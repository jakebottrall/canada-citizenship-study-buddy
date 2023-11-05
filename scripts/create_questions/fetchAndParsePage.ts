import { JSDOM } from 'jsdom';
import prettier from 'prettier';

const baseUrl =
	'https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/discover-canada/read-online/';

export const fetchAndParsePage = async (pageName: string) => {
	console.info('Fetching & parsing html');

	const pageUrl = `${baseUrl}${pageName}.html`;

	const res = await fetch(pageUrl);
	const html = await res.text();

	const dom = new JSDOM(html);
	const mainEl = dom.window.document.querySelector('main');

	if (!mainEl) {
		throw new Error('Could not find main element');
	}

	mainEl.querySelector('.pagination')?.remove();
	mainEl.querySelector('.pagedetails')?.remove();
	mainEl.querySelector('time')?.closest('div')?.remove();
	mainEl.querySelectorAll('[lang="fr"]')?.forEach((el) => el.remove());
	mainEl.querySelectorAll('script')?.forEach((el) => el.remove());
	mainEl.querySelectorAll('*').forEach((el) => el.removeAttribute('class'));
	mainEl.querySelectorAll('audio').forEach((el) => el.closest('details')?.remove());
	mainEl.querySelectorAll('video').forEach((el) => el.closest('section')?.remove());

	const findAndRemoteEmptyEl = (el: Element | null) => {
		if (!el) {
			return;
		}

		if (!el.innerHTML.trim()) {
			const parent = el.parentElement;
			el.remove();
			findAndRemoteEmptyEl(parent);
		}
	};

	mainEl.querySelectorAll('div, span').forEach((el) => findAndRemoteEmptyEl(el));

	const pageHtml = await prettier.format(mainEl.innerHTML, { parser: 'html' });

	return { pageHtml, pageUrl };
};
