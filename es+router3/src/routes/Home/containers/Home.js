import { connect } from 'react-redux';
import model from '../models/home';
import Home from '../components/Home';

const mapStateToProps = state => ({
  ...state[model.namespace]
});

const mapDispatchToProps = {
  ...model.effects
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
