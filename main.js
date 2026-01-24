// MicroCMS Config
// ★ここに、後ほど取得する「サービスドメイン」と「APIキー」を入力します
const MICROCMS_SERVICE_DOMAIN = "triangle-eq";
const MICROCMS_API_KEY = "NqUUbWbqw7OA6Ta5cWV6ZNCDxKQraWb7Q1l1";

console.log('Triangle EQ Website Loaded');

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle Logic
    const toggle = document.querySelector('.header__mobile-toggle');
    const nav = document.querySelector('.header__nav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    // Determine current page and fetch content accordingly
    const path = window.location.pathname;

    // Check if we are on index.html or topics.html (List pages)
    const topicsList = document.querySelector('.topics__list');
    if (topicsList) {
        fetchTopics(topicsList);
    }

    // Check if we are on news_detail.html (Detail page)
    const articleContainer = document.getElementById('article-container');
    if (articleContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const contentId = urlParams.get('id');

        if (contentId) {
            fetchTopicDetail(contentId, articleContainer);
        } else if (articleContainer) {
            articleContainer.innerHTML = '<p style="text-align:center">記事が見つかりません。URLを確認してください。</p>';
        }
    }
});

// --- MicroCMS Fetch Functions ---

async function fetchTopics(containerElement) {
    try {
        const response = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/topics?limit=10`, {
            headers: {
                "X-MICROCMS-API-KEY": MICROCMS_API_KEY
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        renderTopicsList(data.contents, containerElement);

    } catch (error) {
        console.error('Error fetching topics:', error);
        // エラー時は何もしない（静的HTMLがあればそれが残る、なければ空になる）
        // containerElement.innerHTML = '<p>読み込みに失敗しました</p>';
    }
}

async function fetchTopicDetail(contentId, containerElement) {
    try {
        const response = await fetch(`https://${MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/topics/${contentId}`, {
            headers: {
                "X-MICROCMS-API-KEY": MICROCMS_API_KEY
            }
        });

        if (!response.ok) throw new Error('Article not found');

        const data = await response.json();
        renderTopicDetail(data, containerElement);

    } catch (error) {
        console.error('Error fetching detail:', error);
        containerElement.innerHTML = '<p style="text-align:center">記事が見つかりませんでした。</p>';
    }
}

// --- Render Functions ---

function renderTopicsList(contents, container) {
    if (!contents || contents.length === 0) return;

    // Clear existing static content if we successfully fetched data
    container.innerHTML = '';

    contents.forEach(item => {
        // Date formatting
        const dateStr = item.date ? new Date(item.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : '----.--.--';

        // Category (custom field or default)
        const category = item.category && item.category.length > 0 ? item.category[0] : 'News';

        const li = document.createElement('li');
        li.className = 'topics__item';
        li.innerHTML = `
            <span class="topics__date">${dateStr}</span>
            <span class="topics__cat">${category}</span>
            <a href="news_detail.html?id=${item.id}" class="topics__link">${item.title}</a>
        `;
        container.appendChild(li);
    });
}

function renderTopicDetail(item, container) {
    const dateStr = item.date ? new Date(item.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : '----.--.--';
    const category = item.category && item.category.length > 0 ? item.category[0] : 'News';

    container.innerHTML = `
        <article class="news-detail">
            <header class="news-detail__header" style="border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 40px;">
                <div class="news-detail__meta" style="margin-bottom: 15px; color: #666;">
                    <span class="news-detail__date" style="font-weight:bold; margin-right:15px;">${dateStr}</span>
                    <span class="news-detail__cat" style="background:#003366; color:#fff; padding:4px 12px; font-size:0.8rem; border-radius:2px;">${category}</span>
                </div>
                <h1 class="news-detail__title" style="font-size: 2rem; color: #003366; line-height: 1.4;">${item.title}</h1>
            </header>
            <div class="news-detail__body post-content">
                ${item.body}
            </div>
            <div class="news-detail__footer" style="margin-top: 60px; text-align: center;">
                <a href="topics.html" class="btn">一覧に戻る</a>
            </div>
        </article>
    `;
}
