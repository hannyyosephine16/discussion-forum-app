import { useSelector } from 'react-redux';

function LoadingBar() {
  const { loadingMessage } = useSelector((state) => state.ui);

  return (
    <div className="loading-bar">
      <div className="loading-progress"></div>
      {loadingMessage && <p className="loading-message">{loadingMessage}</p>}
    </div>
  );
}

export default LoadingBar;