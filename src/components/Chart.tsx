'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { PopulationData } from '@/types/population';
import styles from './Chart.module.css';
import { useEffect, useState } from 'react';


interface ChartProps {
  data: PopulationData[];
  category: 'total' | 'young' | 'working' | 'elderly';
}

const categoryLabelMap = {
  total: '総人口',
  young: '年少人口',
  working: '生産年齢人口',
  elderly: '老年人口',
};




export default function Chart({ data, category }: ChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定（幅が768px未満で true）
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  if (data.length === 0) return <p>グラフに表示するデータがありません</p>;

  // 年ごとのデータに整形（横軸：年、各系列：都道府県）
  const merged = data[0].data.map((_, i) => {
    const row: { year: number; [key: string]: number } = {
      year: data[0].data[i].year,
    };
    data.forEach((pref) => {
      row[pref.prefName] = pref.data[i] [category];
    });
    return row;
  });

  return (
    <div className={styles.chartContainer}>
      <h2 className={styles.graphTitle}>人口データグラフ</h2>
      <div className={styles.graphArea}>
        <div className={styles.inner}>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={merged}>
        <CartesianGrid  strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis width={100} />
        <Tooltip trigger={isMobile ? 'click': 'hover'} />
        <Legend  />
        {data.map((pref) => (
          <Line
            key={pref.prefCode}
            type="monotone"
            dataKey={pref.prefName}
            name={pref.prefName}
            stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
      </div>
        </div>
    </div>
  );
}