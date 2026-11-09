import {plan} from './core.mjs';
self.onmessage=({data})=>{try{self.postMessage({result:plan(data)});}catch(e){self.postMessage({error:e.message});}};
