import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const prefsParam = url.searchParams.get('prefs'); // カンマ区切りの都道府県名
  const prefs = prefsParam ? prefsParam.split(',') : [];

  if (prefs.length === 0) {
    return NextResponse.json({ error: '都道府県が選択されていません。' }, {
    status: 400,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    });
  }

  // 複数都道府県に対応して結果をまとめる
  const results = await Promise.all(
    prefs.map(async (prefName: string) => {
      const code = getPrefCode(prefName);
      if (!code) return { pref: prefName, error: 'コード不明' };
      
      try{
      const res = await fetch(
        `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${code}`,{
          method: 'GET',
          headers: {
            'X-API-KEY': '8FzX5qLmN3wRtKjH7vCyP9bGdEaU4sYpT6cMfZnJ',
            'Content-Type': 'application/json; charest=UTF-8',
          },
        });


      const json = await res.json();
      return { pref: prefName, data: json.result };
    } catch(e) {
      return { pref: prefName, error: '取得失敗' };
    }
    })
  );

  


  return NextResponse.json(results,{
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });
}

// 都道府県名→コード
function getPrefCode(name: string): string | null {
  const map: Record<string, string> = {
    '北海道': '01', '青森県': '02', '岩手県': '03', '宮城県': '04', '秋田県': '05', '山形県': '06',
    '福島県': '07', '茨城県': '08', '栃木県': '09', '群馬県': '10', '埼玉県': '11', '千葉県': '12',
    '東京都': '13', '神奈川県': '14', '新潟県': '15', '富山県': '16', '石川県': '17', '福井県': '18',
    '山梨県': '19', '長野県': '20', '岐阜県': '21', '静岡県': '22', '愛知県': '23', '三重県': '24',
    '滋賀県': '25', '京都府': '26', '大阪府': '27', '兵庫県': '28', '奈良県': '29', '和歌山県': '30',
    '鳥取県': '31', '島根県': '32', '岡山県': '33', '広島県': '34', '山口県': '35',
    '徳島県': '36', '香川県': '37', '愛媛県': '38', '高知県': '39',
    '福岡県': '40', '佐賀県': '41', '長崎県': '42', '熊本県': '43', '大分県': '44',
    '宮崎県': '45', '鹿児島県': '46', '沖縄県': '47',
  };
  return map[name] || null;
}



