# Script 1: Set up the Next.js app with TypeScript, Tailwind CSS, and Shadcn
cd ../
npx create-next-app@latest company-dashboard --typescript --tailwind --yes
cd company-dashboard

# Install dependencies
npm install next react@18.2.0 react-dom@18.2.0 tailwindcss lucide-react @radix-ui/react-slot class-variance-authority clsx tailwind-merge \
&& npm install --save-dev typescript @types/react@18 @types/react-dom@18 @types/node \
&& npx shadcn@latest init -d \
&& npx shadcn@latest add button card \
&& npm install recharts

# Create the required files
mkdir -p app/api/{users,teams,signups} components/ui

# Create the API routes
cat << 'EOF' > app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = [
    { month: 'Jan', activeUsers: 1200 },
    { month: 'Feb', activeUsers: 1500 },
    { month: 'Mar', activeUsers: 1800 },
    { month: 'Apr', activeUsers: 2000 },
    { month: 'May', activeUsers: 2200 },
    { month: 'Jun', activeUsers: 2500 },
  ];
  return NextResponse.json(users);
}
EOF

cat << 'EOF' > app/api/teams/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const teams = [
    { month: 'Jan', activeTeams: 100 },
    { month: 'Feb', activeTeams: 120 },
    { month: 'Mar', activeTeams: 140 },
    { month: 'Apr', activeTeams: 160 },
    { month: 'May', activeTeams: 180 },
    { month: 'Jun', activeTeams: 200 },
  ];
  return NextResponse.json(teams);
}
EOF

cat << 'EOF' > app/api/signups/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const signups = [
    { month: 'Jan', signups: 300 },
    { month: 'Feb', signups: 400 },
    { month: 'Mar', signups: 500 },
    { month: 'Apr', signups: 600 },
    { month: 'May', signups: 700 },
    { month: 'Jun', signups: 800 },
  ];
  return NextResponse.json(signups);
}
EOF

# Create the dashboard page
cat << 'EOF' > app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Data {
  month: string;
  activeUsers?: number;
  activeTeams?: number;
  signups?: number;
}

export default function Dashboard() {
  const [data, setData] = useState<Data[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, teamsRes, signupsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/teams'),
        fetch('/api/signups'),
      ]);
      const users = await usersRes.json();
      const teams = await teamsRes.json();
      const signups = await signupsRes.json();

      const combinedData = users.map((user: Data, index: number) => ({
        month: user.month,
        activeUsers: user.activeUsers,
        activeTeams: teams[index].activeTeams,
        signups: signups[index].signups,
      }));
      setData(combinedData);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Company Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Active Users</h2>
          <p className="text-2xl font-bold text-blue-600">
            {data.reduce((acc, curr) => acc + (curr.activeUsers || 0), 0)}
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Monthly Active Teams</h2>
          <p className="text-2xl font-bold text-green-600">
            {data.reduce((acc, curr) => acc + (curr.activeTeams || 0), 0)}
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800">Signups</h2>
          <p className="text-2xl font-bold text-purple-600">
            {data.reduce((acc, curr) => acc + (curr.signups || 0), 0)}
          </p>
        </Card>
      </div>
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Metrics</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="activeUsers" fill="#3b82f6" name="Active Users" />
            <Bar dataKey="activeTeams" fill="#22c55e" name="Active Teams" />
            <Bar dataKey="signups" fill="#a855f7" name="Signups" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
EOF

# Start the app
npm run dev
