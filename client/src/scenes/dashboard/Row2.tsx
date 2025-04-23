import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import { useGetKpisQuery, useGetProductsQuery } from "@/state/api";
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { useMemo } from "react";
import {
  Tooltip,
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const pieData = [
  { name: "Active Campaigns", value: 600 },
  { name: "Target Revenue", value: 400 },
];

const Row2 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[300]];
  const { data: operationalData, isLoading: loadingKpis } = useGetKpisQuery();
  const { data: productData, isLoading: loadingProducts } = useGetProductsQuery();

  // Handle operational expenses
  const operationalExpenses = useMemo(() => {
    if (!operationalData) return [];
    return operationalData[0]?.monthlyData?.map(({ month, operationalExpenses, nonOperationalExpenses }) => ({
      name: month.substring(0, 3),
      "Operational Expenses": operationalExpenses,
      "Non Operational Expenses": nonOperationalExpenses,
    })) || [];
  }, [operationalData]);

  // Handle product expense data
  const productExpenseData = useMemo(() => {
    if (!productData) return [];
    return productData?.map(({ _id, price, expense }) => ({
      id: _id,
      price,
      expense,
    })) || [];
  }, [productData]);

  // Show loading state
  if (loadingKpis || loadingProducts) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Line Chart - Operational vs Non-Operational Expenses */}
      <DashboardBox gridArea="d">
        <BoxHeader title="Crypto Asset vs. Non-Crypto Asset Investment" sideText="+4%" />
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={operationalExpenses} margin={{ top: 20, right: 0, left: -10, bottom: 55 }}>
            <CartesianGrid vertical={false} stroke={palette.grey[800]} />
            <XAxis dataKey="name" tickLine={false} style={{ fontSize: "12px" }} />
            <YAxis yAxisId="left" orientation="left" tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
            <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} style={{ fontSize: "12px" }} />
            <Tooltip formatter={(value) => `$${value}`} />
            <Line yAxisId="left" type="monotone" dataKey="Non Operational Expenses" stroke={palette.tertiary[500]} strokeWidth={2} />
            <Line yAxisId="right" type="monotone" dataKey="Operational Expenses" stroke={palette.primary.main} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Pie Chart - Campaigns and Targets */}
      <DashboardBox gridArea="e">
        <BoxHeader title="Crypto Campaigns & Financial Targets" sideText="+4%" />
        <FlexBetween mt="0.25rem" gap="1.5rem" pr="1rem">
          <PieChart width={110} height={100} margin={{ top: 0, right: -10, left: 10, bottom: 0 }}>
            <Pie stroke="none" data={pieData} innerRadius={18} outerRadius={38} paddingAngle={2} dataKey="value">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index]} />
              ))}
            </Pie>
          </PieChart>
          <Box flexBasis="40%" textAlign="center">
            <Typography variant="h5">Target Revenue</Typography>
            <Typography m="0.3rem 0" variant="h3" color={palette.primary[300]}>
              83
            </Typography>
            <Typography variant="h6">Crypto Campaign Finance Goals & Financial Outcomes</Typography>
          </Box>
          <Box flexBasis="40%">
            <Typography variant="h5">Decline in Asset Revenue</Typography>
            <Typography variant="h6">Crypto Losses Reduced by 25%</Typography>
            <Typography mt="0.4rem" variant="h5">Profit Margins</Typography>
            <Typography variant="h6">Crypto Margins Are Up by 30% Compared to Last Month</Typography>
          </Box>
        </FlexBetween>
      </DashboardBox>

      {/* Scatter Chart - Product Prices vs Expenses */}
      <DashboardBox gridArea="f">
        <BoxHeader title="Crypto Asset Prices vs Revenue" sideText="+4%" />
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 25, bottom: 40, left: -10 }}>
            <CartesianGrid stroke={palette.grey[800]} />
            <XAxis type="number" dataKey="price" name="Crypto Price" axisLine={false} tickLine={false} style={{ fontSize: "12px" }} tickFormatter={(v) => `$${v}`} />
            <YAxis type="number" dataKey="expense" name="Expense" axisLine={false} tickLine={false} style={{ fontSize: "12px" }} tickFormatter={(v) => `$${v}`} />
            <ZAxis type="number" range={[20]} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Scatter name="Crypto Asset Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
          </ScatterChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;
