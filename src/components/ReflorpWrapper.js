import { PropTypes, Component } from 'react';
import refetch, { getStore, getEntities } from './reflorpRefetch';
import { update } from '../utils/reducer';

@refetch(() => {
  const create = {};
  const edit = {};
  const editDraft = {};
  const myDelete = {};
  const loadMore = {};
  Object.keys(getEntities()).forEach((entity) => {
    create[`${entity}Create`] = true;
    edit[`${entity}Edit`] = true;
    editDraft[`${entity}EditDraft`] = true;
    myDelete[`${entity}Delete`] = true;
    loadMore[`${entity}LoadMore`] = true;
  });

  return {
    ...create,
    ...edit,
    ...editDraft,
    ...myDelete,
    ...loadMore,
  };
})
export default class ReflorpWrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  componentWillMount() {
    this.refresh(this.props);
  }

  refresh(props) {
    const store = getStore();

    Object.keys(getEntities()).forEach((entity) => {
      store.dispatch(update(`${entity}Create`, props[`${entity}Create`]));
      store.dispatch(update(`${entity}Edit`, props[`${entity}Edit`]));
      store.dispatch(update(`${entity}EditDraft`, props[`${entity}EditDraft`]));
      store.dispatch(update(`${entity}Delete`, props[`${entity}Delete`]));
      store.dispatch(update(`${entity}LoadMore`, props[`${entity}LoadMore`]));
    });
  }

  render() {
    return this.props.children ? this.props.children : null;
  }
}
