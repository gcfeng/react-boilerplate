import { connect } from 'react-redux';
import model from './model';
import Home from './Home';

const mapStateToProps = (state: any) => ({
  ...state[model.namespace]
});

const mapDispatchToProps = {
  ...model.effects
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
