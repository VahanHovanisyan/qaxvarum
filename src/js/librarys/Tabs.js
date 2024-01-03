export class Tabs {
	constructor(selector, options) {
		let defaultOptions = {
			isChanged: () => { }
		}
		this.options = Object.assign(defaultOptions, options);
		this.selector = selector;
		this.tabs = document.querySelector(`[data-tabs="${selector}"]`);
		if (this.tabs) {
			this.tabList = this.tabs.querySelector('.tabs__list');
			this.tabsBtns = this.tabList.querySelectorAll('.tabs__button');
			this.tabsPanels = this.tabs.querySelectorAll('.tabs__panel');
		}
		this.events();
		this.init();

	}

	init() {
		this.tabList.setAttribute('role', 'tablist');

		this.tabsBtns.forEach((el, i) => {
			el.setAttribute('role', 'tab');
			el.setAttribute('id', `${this.selector}${i + 1}`);
			el.classList.remove('tabs__button_active');
		});

		this.tabsPanels.forEach((el, i) => {
			el.setAttribute('role', 'tabpanel');
			el.setAttribute('aria-labelledby', this.tabsBtns[i].id);
			el.classList.remove('tabs__panel_active');
		});

	}

	events() {
		this.tabsBtns.forEach((el) => {
			el.addEventListener('click', (e) => {
				let currentTab = this.tabList.querySelector('[aria-selected]');

				if (e.currentTarget !== currentTab) {
					this.switchTabs(e.currentTarget, currentTab);
				}
				if (e.target.closest('.hero__tooltip')) {
					
				}
			});
		});
	}

	switchTabs(newTab, oldTab = this.tabs.querySelector('[aria-selected]')) {
		newTab.focus();
		newTab.removeAttribute('tabindex');
		newTab.setAttribute('aria-selected', 'true');

		oldTab?.removeAttribute('aria-selected');
		oldTab?.setAttribute('tabindex', '-1');

		let index = Array.prototype.indexOf.call(this.tabsBtns, newTab);
		let oldIndex = Array.prototype.indexOf.call(this.tabsBtns, oldTab);

		this.tabsPanels[oldIndex]?.classList.remove('tabs__panel_active');
		this.tabsPanels[index]?.classList.add('tabs__panel_active');

		this.tabsBtns[oldIndex]?.classList.remove('tabs__button_active');
		this.tabsBtns[index]?.classList.add('tabs__button_active');

		this.options.isChanged(this);
	}
}