import RegisterModal from './components/register-modal';
import Home from './page/home';

const App = () => {
  return (
    <div>
      <div className='flex justify-center items-center p-2'>
        <RegisterModal />
      </div>
      <Home />
    </div>
  );
};

export default App;
