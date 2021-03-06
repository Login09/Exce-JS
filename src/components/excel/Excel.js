import {$} from '../../core/dom'
import { Emitter } from '../../core/Emitter';
import {StoreSubscriber} from "../../core/StoreSubscriber";
import {preventDefault} from "../../core/utils";
import {changeTitle} from "../../redux/actions";

// воедино объединяет наши классы Header,Formula...Создает Dom дерево
export class Excel {
  constructor(options) { //selector = #app,options =  components:[Header, Toolbar, Formula, Table] наши классы
      this.components = options.components || [];
      this.store = options.store;
      this.emitter = new Emitter();
      this.subscriber = new StoreSubscriber(this.store);
}
  getRoot() {
      const $root = $.create('div', 'excel');
      const componentOptions = {
          emitter: this.emitter,
          store: this.store
   }
   //добавляем наши компоненты в блок excel
   this.components = this.components.map(Component => { //перебираем компоненты т.е. классы Toolbar,Formula и.т.д
      const $el = $.create('div', Component.className); //div.excel__formula...
      const component = new Component($el, componentOptions);
      $el.html(component.toHTML());
      $root.append($el);
       return component;
    });
    return $root;
  }

  init() {
    if (process.env.NODE_ENV === 'production') {
        document.addEventListener('contextmenu', preventDefault)
    }
    this.subscriber.subscribeComponents(this.components);
    this.components.forEach(component => {
      component.init()
    });
  }

  destroy() {
      this.subscriber.unsubscribeFromStore();
      this.components.forEach(component => component.destroy());
      document.removeEventListener('contextmenu', preventDefault)
  }
}