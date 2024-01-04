const disableScroll = () => {
	const fixBlocks = document?.querySelectorAll('.fixed-block');
	const pagePosition = window.scrollY;
	const paddingOffset = `${(window.innerWidth - document.body.offsetWidth)
		}px`;

	document.documentElement.style.scrollBehavior = 'none';
	fixBlocks.forEach(el => { el.style.paddingRight = paddingOffset; });
	document.body.style.paddingRight = paddingOffset;
	document.body.classList.add('dis-scroll');
	document.body.dataset.position = pagePosition;
	document.body.style.top = `-${pagePosition} px`;
}

const enableScroll = () => {
	const fixBlocks = document?.querySelectorAll('.fixed-block');
	const pagePosition = parseInt(document.body.dataset.position, 10);
	fixBlocks.forEach(el => { el.style.paddingRight = '0px'; });
	document.body.style.paddingRight = '0px';

	document.body.style.top = 'auto';
	document.body.classList.remove('dis-scroll');
	window.scroll({
		top: pagePosition,
		left: 0
	});
	document.body.removeAttribute('data-position');
}

function popup(popupElem, popupBtn) {
	const popup = document.querySelector(popupElem);
	document.addEventListener('click', function (event) {
		if (event.target.closest(popupBtn)) {
			popup.classList.add('popup_open');
			disableScroll();
		}
		if (event.target === popup || event.target.closest('.popup__close-button')) {
			popup.classList.remove('popup_open');
			setTimeout(() => {
				enableScroll();
			}, 300);
			event.preventDefault();
		}
	});
	// Փակեք popup պատուհանը, երբ սեղմվում է ESC
	window.addEventListener('keydown', (e) => {
		if (e.key === "Escape") {
			popup.classList.remove("popup_open")
		}
	});
};

popup(".popup_table", ".popup-table-open-button");
popup(".popup_date-time", ".popup-date-time-open-button");

class Tabs {
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
const tabs = new Tabs('tabs');

const currentTabs = document.querySelector('[data-tabs="tabs"]');

currentTabs.addEventListener('click', function (e) {
	const tabsButton = e.target.closest('.tabs__button');
	const activeTabsTooltip = e.target.closest('.hero__tooltip');
	const activeTabsPanel = currentTabs.querySelector('.tabs__panel_active');
	const tabsPanels = currentTabs.querySelectorAll('.tabs__panel');
	const tabsButtons = currentTabs.querySelectorAll('.tabs__button');
	const getAllStudentsButton = e.target.closest('#get-all-students-button');

	if (getAllStudentsButton) {
		tabsPanels.forEach(tabsPanel => {
			tabsPanel.classList.add('tabs__panel_active');
			tabsPanel.querySelector('[data-grafik-table]').style.display = 'none';
			tabsPanel.querySelector('[data-big-table]').style.display = 'grid';
			tabsPanel.querySelector('[data-students-length]').style.display = 'block'
			tabsPanel.querySelector('[data-students-length]').textContent = 'Քանակ։' +
				tabsPanel.querySelector('[data-big-table] .table__body').querySelectorAll('.table__row').length;
			tabsButtons.forEach(tabsButton => {
				tabsButton.classList.add('tabs__button_active')

				if (tabsButton.id === tabsPanel.getAttribute('aria-labelledby')) {
					tabsPanel.querySelectorAll('.table__caption').forEach(caption => {
						caption.textContent = tabsButton.querySelector('[data-teacher-name]').textContent;
					})
				}
			})
		})
	}

	if (tabsButton) {
		tabsButtons.forEach(tabsButton => {
			tabsButton.classList.remove('tabs__button_active');
		})
		tabsPanels.forEach(tabsPanel => {
			tabsPanel.classList.remove('tabs__panel_active');
			if (tabsButton.id === tabsPanel.getAttribute('aria-labelledby')) {
				tabsPanel.classList.add('tabs__panel_active');
				tabsPanel.querySelectorAll('.table__caption').forEach(caption => {
					caption.textContent = tabsButton.querySelector('[data-teacher-name]').textContent;
				})
			}
		})
		tabsButton.classList.add('tabs__button_active');

		activeTabsPanel.querySelector('[data-big-table]').style.display = 'grid'
		activeTabsPanel.querySelector('[data-grafik-table]').style.display = 'none'
		activeTabsPanel.querySelector('[data-students-length]').style.display = 'block'
		activeTabsPanel.querySelector('[data-students-length]').textContent = 'Քանակ։' + activeTabsPanel.querySelector('[data-big-table] .table__body').querySelectorAll('.table__row').length;
	}

	if (activeTabsTooltip) {
		activeTabsPanel.querySelector('[data-big-table]').style.display = 'none'
		activeTabsPanel.querySelector('[data-grafik-table]').style.display = 'grid'
		activeTabsPanel.querySelector('[data-students-length]').style.display = 'none'

		activeTabsPanel.querySelector('[data-grafik-table]').querySelector('[data-grafik-students-length]').textContent = 'Քանակ։' +
			activeTabsPanel.querySelector('[data-grafik-table] .table__body').querySelectorAll('.table__row').length;
	}
})





