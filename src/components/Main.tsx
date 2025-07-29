'use client';

import styles from './Main.module.css';
import { useState, useEffect } from 'react';
import { PopulationData, Prefecture } from '@/types/population';

const prefectures = [
    '北海道',
    '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
    '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県', 
    '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
    '岐阜県', '静岡県', '愛知県', '三重県',
    '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
    '鳥取県', '島根県', '岡山県', '広島県', '山口県',
    '徳島県', '香川県', '愛媛県', '高知県',
    '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県',
    '沖縄県'
];


interface MainProps {
  prefectures: Prefecture[];
  onChange: (prefs: PopulationData[]) => void;
}

interface PopulationCategory {
  label: string;
  data: {
    year: number;
    value: number;
  }[];
}


export default function Main({ onChange}: MainProps){
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [populationData, setPopulationData] = useState<PopulationData[]>([]);

  // ✅ 初回マウント時に都道府県一覧を取得
  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const res = await fetch('https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures', {
          headers: {
            'X-API-KEY': '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ',
          },
        });
        const data = await res.json();
        setPrefectures(data.result); // 正常に都道府県リストをセット
      } catch (err) {
        console.error('都道府県一覧の取得に失敗しました', err);
      }
    };

    fetchPrefectures();
  }, []);

  const handleChange = async (prefName: string, prefCode: number) => {
    const isSelected = selected.includes(prefCode);
    const updateSelected = isSelected
      ? selected.filter((code) => code !== prefCode)
      : [...selected, prefCode];

    setSelected(updateSelected);

    let updateData = [...populationData];

      if (!isSelected) {
        try {
      const res = await fetch(
          `https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear?prefCode=${prefCode}`,
          {
            method: 'GET',
            headers: {
              'X-API-KEY': '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ',
              'Content-Type': 'application/json;charset=UTF-8'
            },
          }
        );

          const json = await res.json();
          const result: PopulationCategory[] = json.result.data;
          const total = result.find((r) => r.label === '総人口');
          const young = result.find((r) => r.label === '年少人口');
          const working = result.find((r) => r.label === '生産年齢人口');
          const elderly = result.find((r) => r.label === '老年人口');



          if (total && young && working && elderly) {
          const mergedData = total.data.map ((d: any, i: number) => ({
              year: d.year,
              total: d.value,
              young: young.data[i].value,
              working: working.data[i].value,
              elderly: elderly.data[i].value,
            }));

            updateData.push({
                prefCode,
                prefName,
                data: mergedData,
            });
        }
      } catch (err) {
        console.error(`人口データ取得に失敗しました (${prefName})`, err);
      }
    } else {
      updateData = updateData.filter((d) => d.prefCode !== prefCode);
    }

    setPopulationData(updateData);
    onChange(updateData);
  };

  return (
    <main className={styles.main}>
      <div className={styles.prefectureSection}>
        <span className={styles.label}>都道府県一覧</span>
        <div className={styles.checkboxGrid}>
          {prefectures.map((pref) => (
            <label key={pref.prefCode} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selected.includes(pref.prefCode)}
                onChange={() => handleChange(pref.prefName, pref.prefCode)}
              />
              <span>{pref.prefName}</span>
            </label>
          ))}
        </div>
      </div>
    </main>
  );
}




