import { useSelection } from './hooks/useSelection';
import { SelectionTooltip } from './components/SelectionTooltip';
import { useEffect } from 'react';
import { tooltipStore } from './store/tooltip';

function App() {
  const selection = useSelection();

  useEffect(() => {
    if (selection) {
      tooltipStore.visible = true;
      tooltipStore.position = selection.position;
    }
  }, [selection]);

  return <SelectionTooltip />;
}

export default App;