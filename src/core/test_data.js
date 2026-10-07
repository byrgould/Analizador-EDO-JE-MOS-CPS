import { EIKOSANY_DATA } from './eikosany-data.js';
import { HEXANY_1_6, HEXANY_5_6 } from './hexany-data.js';
import { PENTADEKANY_2_6, PENTADEKANY_4_6 } from './pentadekany-data.js';
import { MONANY_0_6, MONANY_6_6 } from './monany-data.js';

console.log("Eikosany Dyanies:", EIKOSANY_DATA["Dyanies"]?.length);
console.log("2_6 Pentadekany Dyanies:", PENTADEKANY_2_6["Dyanies"]?.length);
console.log("4_6 Pentadekany Tetranies:", PENTADEKANY_4_6["Tetranies"]?.length);
console.log("1_6 Hexany Pentanies:", HEXANY_1_6["Pentanies"]?.length);
console.log("5_6 Hexany Dyanies:", HEXANY_5_6["Dyanies"]?.length);
console.log("0_6 Monany Monanies:", MONANY_0_6["Monanies"]?.length);
console.log("6_6 Monany Monanies:", MONANY_6_6["Monanies"]?.length);
