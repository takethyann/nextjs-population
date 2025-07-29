'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Main from '@/components/Main';
import styles from '@/styles/page.module.css';
import Chart from '@/components/Chart';
import { PopulationData, Prefecture } from '@/types/population';



export default function Page() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefs, setSelectedPrefs] = useState<PopulationData[]>([]);
  const [category, setCategory] = useState<'total' | 'young' | 'working' | 'elderly'>('total');;


  useEffect(() => {
    const fetchPrefectures = async () => {
      try{
      const res = await fetch(
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures',{
          method: 'GET',
          headers: {
            'X-API-KEY': '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ',
            'Content-Type': 'application/json; charset=UTF-8',
          },
        }
      );

      const data = await res.json();
      setPrefectures(data.result);
    } catch (err) {
      console.error('都道府県取得エラー:', err);
    }
  };

    fetchPrefectures();
  }, []);


  return (
      <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <Main  prefectures={prefectures} onChange={setSelectedPrefs} />
        

      
        <Chart data={selectedPrefs} category={category} setCategory={setCategory}/>
      </main>

      <Footer />
    </div>
  );
}


