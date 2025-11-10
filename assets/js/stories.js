export const stories = {

    _containerId: 'stories-section',
    _modalId: 'stories-modal',
    _basePath: 'assets/lang/',
    _data: null,
    _lang: 'de',

    structure: {
        root: 'stories',
        fields: {
            section: 'section',
            id: 'id',
            title: 'title',
            subtitle: 'subtitle',
            excerpt: 'excerpt',
            body: 'body'
        }
    },

    init() {
        const container = document.getElementById(stories._containerId);
        if (!container) {
            console.warn('[Stories] Container nicht gefunden:', stories._containerId);
            return;
        }

        container.innerHTML = '';
        stories._createStructure(container);
        stories.load(stories._lang);
    },

    load(lang) {
        stories._lang = lang;
        const path = stories._basePath + 'stories_' + lang + '.json';
        stories._data = stories.loadJSON(path);

        if (!stories._data) {
            console.error('[Stories] Fehler beim Laden von', path);
            return;
        }

        stories.render();

        if (typeof language !== 'undefined' && language.applyTexts) {
            language.applyTexts(stories._containerId);
        }
    },

    loadJSON(path) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        xhr.send(null);

        if (xhr.status === 200) {
            try {
                return JSON.parse(xhr.responseText);
            } catch (e) {
                console.error('[Stories] JSON-Parsing-Fehler:', e);
            }
        } else {
            console.error('[Stories] HTTP-Fehler beim Laden:', xhr.status);
        }
        return null;
    },

    _createStructure(container) {
        const title = document.createElement('h2');
        title.id = stories._containerId + '-title';
        title.setAttribute('data-lang-key', 'stories_title');
        container.appendChild(title);

        const grid = document.createElement('div');
        grid.id = stories._containerId + '-grid';
        grid.className = 'stories-grid';
        container.appendChild(grid);

        const modal = document.createElement('div');
        modal.id = stories._containerId + '-modal';
        modal.className = 'stories-modal';
        document.body.appendChild(modal);
    },

    render() {
        const f = stories.structure.fields;
        const sectionData = stories._data[f.section];
        const storiesArr = stories._data[stories.structure.root];
        const grid = document.getElementById(stories._containerId + '-grid');

        if (!grid) return;
        grid.innerHTML = '';

        const titleElem = document.getElementById(stories._containerId + '-title');
        if (titleElem && sectionData?.title) {
            titleElem.textContent = sectionData.title;
        }

        for (let i = 0; i < storiesArr.length; i++) {
            const s = storiesArr[i];
            const card = document.createElement('article');
            card.className = 'story-card';

            const inner = document.createElement('div');
            inner.className = 'story-card__inner';

            const h3 = document.createElement('h3');
            h3.textContent = s[f.title];
            h3.className = 'story-card__title';

            const subtitle = document.createElement('p');
            subtitle.className = 'story-card__subtitle';
            subtitle.textContent = s[f.subtitle] ?? '';

            const excerpt = document.createElement('p');
            excerpt.className = 'story-card__excerpt';
            excerpt.textContent = s[f.excerpt] ?? '';

            const actions = document.createElement('div');
            actions.className = 'story-card__actions';

            const btn = document.createElement('button');
            btn.className = 'story-card__btn';
            btn.textContent = sectionData?.labels?.readMore || 'Mehr lesen';
            btn.dataset.id = s[f.id];

            btn.addEventListener('click', function() {
                stories._openModal(s, sectionData);
            });

            actions.appendChild(btn);
            inner.append(h3, subtitle, excerpt, actions);
            card.appendChild(inner);
            grid.appendChild(card);
        }

        const modalContainer = document.getElementById(stories._modalId);
        if (modalContainer && !modalContainer.querySelector('.stories-modal__panel')) {
            stories._createModal(modalContainer, sectionData);
        }
    },

    _createModal(modalContainer, sectionData) {
        while (modalContainer.firstChild) modalContainer.removeChild(modalContainer.firstChild);

        const panel = document.createElement('div');
        panel.className = 'stories-modal__panel';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'stories-modal__close';
        closeBtn.setAttribute('aria-label', sectionData?.labels?.close || 'Schließen');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', function() {
            stories._closeModal();
        });

        const title = document.createElement('h3');
        title.className = 'stories-modal__title';

        const body = document.createElement('div');
        body.className = 'stories-modal__body';

        panel.append(closeBtn, title, body);
        modalContainer.appendChild(panel);

        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) stories._closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') stories._closeModal();
        });
    },

    _openModal(story, sectionData) {
        const f = stories.structure.fields;
        const modalContainer = document.getElementById(stories._modalId);
        const title = modalContainer.querySelector('.stories-modal__title');
        const body = modalContainer.querySelector('.stories-modal__body');

        title.textContent = story[f.title];
        while (body.firstChild) body.removeChild(body.firstChild);

        const subtitle = document.createElement('p');
        subtitle.className = 'story-modal__subtitle';
        subtitle.textContent = story[f.subtitle] ?? '';

        const text = document.createElement('p');
        text.className = 'story-modal__bodytext';
        text.textContent = story[f.body] ?? '';

        body.append(subtitle, text);
        modalContainer.classList.add('is-open');
    },

    _closeModal() {
        const modalContainer = document.getElementById(stories._modalId);
        if (modalContainer) modalContainer.classList.remove('is-open');
    }
};
