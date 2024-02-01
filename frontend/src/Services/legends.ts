import { UPDATE_STATS } from "../Store/Reducers/statsReducer"
import { store } from "../Store/store"

export const colorArray = [
  "#148F77", "#1F618D", "#D4AC0D", // Mountain Meadow, Blue Sapphire, Ochre
  "#AF601A", "#633974", "#BA4A00", // Rust, Dark Purple, Burnt Sienna
  "#3498DB", "#17A589", "#D35400", // Sky Blue, Shamrock, Pumpkin
  "#CB4335", "#7D6608", "#6C3483", // Mahogany, Olive Drab, Royal Purple
  "#1F618D", "#196F3D", "#D68910", // Blue Sapphire, Forest Green, Dark Orange
  "#922B21", "#5B2C6F", "#C27C0E"  // Sangria, Byzantine, Metallic Gold
]

const updateStats = (value: Partial<StatsState>) => {
  return {
    type: UPDATE_STATS,
    value
  }
}

export const isClear = (key: string) => {
const stats = store.getState().stats
  return !stats.legends || stats.legends.hover === key || !stats.legends.hover
}

// Active toutes les légendes
export const activeAllLegends = () => {
  const stats = store.getState().stats
  const item = { ...stats.legends }
  
  Object.keys(item).forEach(key => { item[key] = false });
  item.hover = null
  store.dispatch(updateStats({ 
    showAllLegends: true,
    legends: item as Legends 
  }))
  // eslint-disable-next-line
}

// Si une légende est désactivée le booleen showAllLegends passe à false
export const checkIfStillShowAll = () => {
  const stats = store.getState().stats
  const legendKeys = Object.entries({ ...stats.legends })
  if (legendKeys.some((x) => x[0] !== 'hover' && x[1])) {
    store.dispatch(updateStats({ showAllLegends: false }))
  }
  // eslint-disable-next-line
}

// Initialisation des légendes pour pouvoir les activer / décastiver
export const initializeLegends = (finalData: CalculatedGroupOP[]) => {
  const stats = store.getState().stats
  const tempData = finalData.map((x) => { return { ...x } })
  const item = tempData.sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0]

  if (!stats.legends || Object.keys(item).length !== Object.keys(stats.legends).length) {
    const initialLegends: Legends = { hover: null }

    Object.keys(item).forEach(key => {
      if (key === 'date') return
      if (key === "Total") {
        initialLegends[key] = false;
      } else {
        initialLegends[key] = true;
      }
    });

    store.dispatch(updateStats({ legends: initialLegends }))
  }
  // eslint-disable-next-line
}
// Permet de mettre en évidence la data liée à la légende que l'on survole
export const handleLegendMouseEnter = (e: any) => {
  const stats = store.getState().stats
  if (!stats.legends) return
  if (!stats.legends[e.dataKey]) {
    store.dispatch(updateStats({
      legends: { ...stats.legends, hover: e.dataKey }
    }));
  }
};

// Stoppe la mise en évidence de la légende
export const handleLegendMouseLeave = () => {
  const stats = store.getState().stats
  if (!stats.legends) return
  store.dispatch(updateStats({
    legends: { ...stats.legends, hover: null }
  }));
};

// Ajoute ou retire une légende à celles visibles dans le graph
export const selectBar = (e: any) => {
  const stats = store.getState().stats
  if (!stats.legends) return
  store.dispatch(updateStats({
    legends: {
      ...stats.legends,
      [e.dataKey]: !stats.legends[e.dataKey],
      hover: null
    }
  }));
};