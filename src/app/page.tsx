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
        
        <div style={{ margin: '1rem 0' }}>
          <label>
            <input
              type="radio"
              value="total"
              checked={category === 'total'}
              onChange={() => setCategory('total')}
            /> 総人口
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="young"
              checked={category === 'young'}
              onChange={() => setCategory('young')}
            /> 年少人口
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="working"
              checked={category === 'working'}
              onChange={() => setCategory('working')}
            /> 生産年齢人口
          </label>
          <label style={{ marginLeft: '1rem' }}>
            <input
              type="radio"
              value="elderly"
              checked={category === 'elderly'}
              onChange={() => setCategory('elderly')}
            /> 老年人口
          </label>
        </div>

      
        <Chart data={selectedPrefs} category={category}/>
      </main>

      <Footer />
    </div>
  );
}


