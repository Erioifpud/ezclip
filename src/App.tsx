import { useSelection } from './hooks/useSelection';
import { SelectionTooltip } from './components/SelectionTooltip';
import { useEffect, useState } from 'react';

function App() {
  const selection = useSelection();
  const [showTooltip, setShowTooltip] = useState(false);

  // 当有新的选中文本时显示 tooltip
  useEffect(() => {
    if (selection) {
      setShowTooltip(true);
    }
  }, [selection]);

  return (
    <>
      {selection && showTooltip && (
        <SelectionTooltip
          text={selection.text}
          position={selection.position}
          onClose={() => setShowTooltip(false)}
        />
      )}
    </>
  );
}

export default App;