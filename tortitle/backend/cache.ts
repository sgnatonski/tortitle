import * as Cache from "node-cache";

const cache = new Cache({ stdTTL: 60, checkperiod: 120 });

export default cache;