// 네이버 Book Search API - 서버에서만 호출 (Client Secret 보호)
// 수정: ISBN 검색 시 book_adv.json 사용 (정확한 ISBN 일치 결과 반환)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { query, isbn, display = 10, start = 1, sort = 'sim' } = req.query;

  // ISBN 검색: book_adv.json?d_isbn= (정확 매칭)
  // 일반 검색: book.json?query= (유사도 검색)
  let url;
  if (isbn) {
    const cleanIsbn = String(isbn).replace(/[^0-9X]/gi, '');
    if (!cleanIsbn) return res.status(400).json({ error: 'invalid isbn' });
    url = `https://openapi.naver.com/v1/search/book_adv.json?d_isbn=${encodeURIComponent(cleanIsbn)}&display=${display}`;
  } else if (query) {
    url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`;
  } else {
    return res.status(400).json({ error: 'query or isbn required' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Naver API error', status: response.status });
    }

    const data = await response.json();

    const items = (data.items || []).map(item => ({
      title:       (item.title||'').replace(/<[^>]*>/g, ''),
      author:      (item.author||'').replace(/<[^>]*>/g, ''),
      publisher:   item.publisher,
      pubdate:     item.pubdate,
      isbn:        item.isbn,
      description: (item.description||'').replace(/<[^>]*>/g, ''),
      image:       item.image,
      link:        item.link,
      discount:    item.discount,
    }));

    res.json({ total: data.total, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
