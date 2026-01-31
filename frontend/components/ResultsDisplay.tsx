'use client';

import dynamic from 'next/dynamic';
import { ResultsResponse, BuyingScenarioResults, InvestmentScenarioResults } from '@/types';
import { formatPercent, formatNumber as formatNumberUtil } from '@/lib/utils';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ResultsDisplayProps {
  results: ResultsResponse;
  scenarioType: 'buying' | 'investment' | 'compare';
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('he-IL', {
    maximumFractionDigits: 0,
  }).format(num);
}

function calculateMedianPath(paths: number[][]): number[] {
  if (!paths || paths.length === 0) return [];

  const numTimePoints = paths[0].length;
  const medianPath: number[] = [];

  for (let t = 0; t < numTimePoints; t++) {
    // Get all simulation values at time point t
    const valuesAtTimeT = paths.map(path => path[t]);

    // Calculate median
    const sorted = valuesAtTimeT.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

    medianPath.push(median);
  }

  return medianPath;
}

function SummaryCard({ title, value, subtitle, color }: {
  title: string;
  value: string;
  subtitle?: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color]}`}>
      <p className="text-xs font-medium opacity-60 uppercase tracking-wide mb-1">{title}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {subtitle && <p className="text-xs opacity-60 mt-1">{subtitle}</p>}
    </div>
  );
}

function BuyingResultsSection({ results }: { results: BuyingScenarioResults }) {
  const { summary, final_property_value, net_equity, total_maintenance_cost, remaining_mortgage } = results;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Buying Scenario Results</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Median Net Equity"
          value={`₪${formatNumber(summary.final_value_median)}`}
          color="blue"
        />
        <SummaryCard
          title="Pessimistic (10th %)"
          value={`₪${formatNumber(summary.final_value_pessimistic)}`}
          color="red"
        />
        <SummaryCard
          title="Optimistic (90th %)"
          value={`₪${formatNumber(summary.final_value_optimistic)}`}
          color="green"
        />
        <SummaryCard
          title="Annualized Return (IRR)"
          value={summary.annualized_return ? formatPercent(summary.annualized_return) : 'N/A'}
          subtitle="Accounts for all cash flows"
          color="purple"
        />
      </div>

      {/* IRR Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          What is Annualized Return (IRR)?
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Internal Rate of Return (IRR)</strong> is the true annualized return that accounts for the timing of all cash flows:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Your initial down payment</li>
            <li>All monthly mortgage payments and maintenance costs</li>
            <li>The final net equity (property value - remaining mortgage)</li>
          </ul>
          <p className="pt-1">
            Unlike simple return calculations that assume all money was invested on day 1, IRR correctly values money invested at different times. This makes it the most accurate metric for comparing buying vs. investing.
          </p>
        </div>
      </div>

      {/* Property Value and Mortgage Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Final Property Value Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Median</div>
              <div className="text-lg font-bold text-gray-900 tabular-nums">₪{formatNumber(final_property_value.median)}</div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <div className="text-xs text-gray-500">10th Percentile</div>
              <div className="text-base font-semibold text-red-600 tabular-nums">₪{formatNumber(final_property_value.p10)}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">90th Percentile</div>
              <div className="text-base font-semibold text-green-600 tabular-nums">₪{formatNumber(final_property_value.p90)}</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Mortgage Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Remaining Mortgage</div>
              <div className="text-lg font-bold text-gray-900 tabular-nums">₪{formatNumber(remaining_mortgage)}</div>
            </div>
            <p className="text-xs text-gray-600 pt-2">
              This is the outstanding mortgage balance at the end of the simulation period. Net equity = Property Value - Remaining Mortgage.
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {results.net_equity_paths && results.net_equity_paths.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Net Equity Over Time</h4>
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'lines',
                y: calculateMedianPath(results.net_equity_paths),
                name: 'Median Path',
                line: { color: 'blue', width: 2 },
              },
            ]}
            layout={{
              height: 400,
              margin: { t: 30, r: 30, b: 50, l: 80 },
              xaxis: { title: { text: 'Months' } },
              yaxis: { title: { text: 'Net Equity (ILS)' } },
              showlegend: true,
            }}
            config={{ responsive: true }}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

function InvestmentResultsSection({ results }: { results: InvestmentScenarioResults }) {
  const { summary, final_value_untaxed, final_value_taxed } = results;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Investment Scenario Results</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Median Value (Taxed)"
          value={`₪${formatNumber(summary.final_value_median)}`}
          color="blue"
        />
        <SummaryCard
          title="Pessimistic (10th %)"
          value={`₪${formatNumber(summary.final_value_pessimistic)}`}
          color="red"
        />
        <SummaryCard
          title="Optimistic (90th %)"
          value={`₪${formatNumber(summary.final_value_optimistic)}`}
          color="green"
        />
        <SummaryCard
          title="Annualized Return (IRR)"
          value={summary.annualized_return ? formatPercent(summary.annualized_return) : 'N/A'}
          subtitle="Accounts for all cash flows"
          color="purple"
        />
      </div>

      {/* IRR Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span className="text-lg">ℹ️</span>
          What is Annualized Return (IRR)?
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>Internal Rate of Return (IRR)</strong> is the true annualized return that accounts for the timing of all cash flows:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Your initial investment or down payment</li>
            <li>All monthly contributions, mortgage payments, and expenses</li>
            <li>The final portfolio or property value</li>
          </ul>
          <p className="pt-1">
            Unlike simple return calculations that assume all money was invested on day 1, IRR correctly values money invested at different times. This makes it the most accurate metric for comparing scenarios with different payment schedules.
          </p>
        </div>
      </div>

      {/* Value Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Final Value (Before Tax)</h4>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Median</div>
              <div className="text-xl font-bold text-gray-900 tabular-nums">₪{formatNumber(final_value_untaxed.median)}</div>
            </div>
            <div className="flex justify-between items-end border-t pt-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">10th Percentile</div>
                <div className="text-base font-semibold text-red-600 tabular-nums">₪{formatNumber(final_value_untaxed.p10)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">90th Percentile</div>
                <div className="text-base font-semibold text-green-600 tabular-nums">₪{formatNumber(final_value_untaxed.p90)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Final Value (After Tax)</h4>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Median</div>
              <div className="text-xl font-bold text-gray-900 tabular-nums">₪{formatNumber(final_value_taxed.median)}</div>
            </div>
            <div className="flex justify-between items-end border-t pt-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">10th Percentile</div>
                <div className="text-base font-semibold text-red-600 tabular-nums">₪{formatNumber(final_value_taxed.p10)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">90th Percentile</div>
                <div className="text-base font-semibold text-green-600 tabular-nums">₪{formatNumber(final_value_taxed.p90)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {results.investment_paths_taxed && results.investment_paths_taxed.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Investment Value Over Time</h4>
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'lines',
                y: calculateMedianPath(results.investment_paths_taxed),
                name: 'Median Path (Taxed)',
                line: { color: 'green', width: 2 },
              },
            ]}
            layout={{
              height: 400,
              margin: { t: 30, r: 30, b: 50, l: 80 },
              xaxis: { title: { text: 'Months' } },
              yaxis: { title: { text: 'Investment Value (ILS)' } },
              showlegend: true,
            }}
            config={{ responsive: true }}
            style={{ width: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

function ComparisonSection({ buyingResults, investmentResults }: {
  buyingResults: BuyingScenarioResults;
  investmentResults: InvestmentScenarioResults;
}) {
  const buyingMedian = buyingResults.summary.final_value_median;
  const investmentMedian = investmentResults.summary.final_value_median;
  const difference = investmentMedian - buyingMedian;
  const winner = difference > 0 ? 'Investment' : 'Buying';

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Comparison Summary</h3>

      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6 text-center">
        <p className="text-lg text-indigo-800 mb-2">
          Based on median outcomes, <span className="font-bold">{winner}</span> scenario performs better
        </p>
        <p className="text-3xl font-bold text-indigo-900 tabular-nums">
          Difference: ₪{formatNumber(Math.abs(difference))}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Buying Scenario</h4>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Median Net Equity</div>
              <div className="text-xl font-bold text-gray-900 tabular-nums">₪{formatNumber(buyingMedian)}</div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Pessimistic</div>
                <div className="text-sm font-semibold text-red-600 tabular-nums">₪{formatNumber(buyingResults.summary.final_value_pessimistic)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Optimistic</div>
                <div className="text-sm font-semibold text-green-600 tabular-nums">₪{formatNumber(buyingResults.summary.final_value_optimistic)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-4">Investment Scenario</h4>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Median Value</div>
              <div className="text-xl font-bold text-gray-900 tabular-nums">₪{formatNumber(investmentMedian)}</div>
            </div>
            <div className="flex justify-between items-center border-t pt-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Pessimistic</div>
                <div className="text-sm font-semibold text-red-600 tabular-nums">₪{formatNumber(investmentResults.summary.final_value_pessimistic)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Optimistic</div>
                <div className="text-sm font-semibold text-green-600 tabular-nums">₪{formatNumber(investmentResults.summary.final_value_optimistic)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Side-by-Side Comparison</h4>
        <Plot
          data={[
            {
              type: 'bar',
              name: 'Buying',
              x: ['Pessimistic', 'Median', 'Optimistic'],
              y: [
                buyingResults.summary.final_value_pessimistic,
                buyingResults.summary.final_value_median,
                buyingResults.summary.final_value_optimistic
              ],
              marker: { color: '#4F46E5' },
            },
            {
              type: 'bar',
              name: 'Investment',
              x: ['Pessimistic', 'Median', 'Optimistic'],
              y: [
                investmentResults.summary.final_value_pessimistic,
                investmentResults.summary.final_value_median,
                investmentResults.summary.final_value_optimistic
              ],
              marker: { color: '#10B981' },
            },
          ]}
          layout={{
            height: 400,
            margin: { t: 30, r: 30, b: 50, l: 80 },
            barmode: 'group',
            yaxis: { title: { text: 'Value (ILS)' } },
            showlegend: true,
            legend: { orientation: 'h', y: -0.15 },
          }}
          config={{ responsive: true }}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default function ResultsDisplay({ results, scenarioType }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Simulation Results</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          results.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {results.status}
        </span>
      </div>

      {scenarioType === 'buying' && results.buying_results && (
        <BuyingResultsSection results={results.buying_results} />
      )}

      {scenarioType === 'investment' && results.investment_results && (
        <InvestmentResultsSection results={results.investment_results} />
      )}

      {scenarioType === 'compare' && results.buying_results && results.investment_results && (
        <>
          <ComparisonSection
            buyingResults={results.buying_results}
            investmentResults={results.investment_results}
          />
          <div className="border-t pt-8">
            <BuyingResultsSection results={results.buying_results} />
          </div>
          <div className="border-t pt-8">
            <InvestmentResultsSection results={results.investment_results} />
          </div>
        </>
      )}
    </div>
  );
}
