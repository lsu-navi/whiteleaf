var FAQ_PER_PAGE = 10;
var faqCurrentPage = 1;
var faqTotalCount = 0;

function initFaqPage() {
    loadFaqList(1);
}

function loadFaqList(page) {
    var listEl = document.getElementById('faq-list');
    var paginationEl = document.getElementById('faq-pagination');

    if (!listEl) return;

    listEl.classList.remove('loaded');
    listEl.innerHTML = '<div class="faq-status">로딩 중...</div>';
    if (paginationEl) paginationEl.innerHTML = '';

    var from = (page - 1) * FAQ_PER_PAGE;
    var to = from + FAQ_PER_PAGE - 1;

    supabase
        .from('faq_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)
        .then(function(response) {
            if (response.error) {
                listEl.innerHTML = '<div class="faq-status error">FAQ를 불러오는 중 오류가 발생했습니다.</div>';
                console.error('FAQ load error:', response.error);
                return;
            }

            var data = response.data;
            faqTotalCount = response.count || 0;
            faqCurrentPage = page;

            if (!data || data.length === 0) {
                listEl.innerHTML = '<div class="faq-status">등록된 FAQ가 없습니다.</div>';
                return;
            }

            renderFaqList(data, listEl);
            renderPagination(paginationEl);
        })
        .catch(function(err) {
            listEl.innerHTML = '<div class="faq-status error">FAQ를 불러오는 중 오류가 발생했습니다.</div>';
            console.error('FAQ load error:', err);
        });
}

function renderFaqList(items, container) {
    var html = '';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        html += '<div class="faq-item" data-id="' + item.id + '">';
        html += '<div class="faq-question" onclick="toggleFaqItem(this)">';
        html += '<span class="faq-question-text">' + escapeHtml(item.title) + '</span>';
        html += '<span class="faq-toggle"></span>';
        html += '</div>';
        html += '<div class="faq-answer">';
        html += '<div class="faq-answer-inner">' + escapeHtml(item.content) + '</div>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
    container.classList.add('loaded');
}

function toggleFaqItem(questionEl) {
    var item = questionEl.parentElement;
    var isOpen = item.classList.contains('open');

    var allItems = document.querySelectorAll('.faq-item');
    for (var i = 0; i < allItems.length; i++) {
        allItems[i].classList.remove('open');
    }

    if (!isOpen) {
        item.classList.add('open');
    }
}

function renderPagination(container) {
    if (!container || faqTotalCount <= FAQ_PER_PAGE) return;

    var totalPages = Math.ceil(faqTotalCount / FAQ_PER_PAGE);
    var html = '';

    html += '<button onclick="goToFaqPage(' + (faqCurrentPage - 1) + ')"' +
            (faqCurrentPage <= 1 ? ' disabled' : '') + '>&lt;</button>';

    var startPage = Math.max(1, faqCurrentPage - 2);
    var endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    for (var i = startPage; i <= endPage; i++) {
        html += '<button onclick="goToFaqPage(' + i + ')"' +
                (i === faqCurrentPage ? ' class="active"' : '') + '>' + i + '</button>';
    }

    html += '<button onclick="goToFaqPage(' + (faqCurrentPage + 1) + ')"' +
            (faqCurrentPage >= totalPages ? ' disabled' : '') + '>&gt;</button>';

    container.innerHTML = html;
}

function goToFaqPage(page) {
    var totalPages = Math.ceil(faqTotalCount / FAQ_PER_PAGE);
    if (page < 1 || page > totalPages) return;

    loadFaqList(page);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFaqPage);
} else {
    initFaqPage();
}
