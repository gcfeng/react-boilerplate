import { model } from 'nmodel';

export default model({
  namespace: 'home',

  state: {
    value: ''
  },

  effects: {
    genValue({ update }) {
      update({ value: new Date().getTime() });
    }
  }
});
