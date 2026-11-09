/** Unlimited-parallelism critical path scheduling, with iterative graph algorithms. */
export function plan(input){
 const tasks=input?.tasks;if(!Array.isArray(tasks)||tasks.length===0||tasks.length>50000)throw Error('Provide between 1 and 50,000 tasks.');
 const byId=new Map();for(const t of tasks){if(!t||typeof t.id!=='string'||!t.id.trim()||t.id.length>120||typeof t.duration!=='number'||!Number.isFinite(t.duration)||t.duration<0||t.duration>1e9||!Array.isArray(t.dependsOn)||t.dependsOn.some(x=>typeof x!=='string'))throw Error('Each task needs an id, finite nonnegative duration, and dependsOn array.');if(byId.has(t.id))throw Error('Duplicate task id: '+t.id);byId.set(t.id,{...t,dependsOn:[...new Set(t.dependsOn)]});}
 const next=new Map([...byId.keys()].map(id=>[id,[]]));const degrees=new Map();let edges=0;
 for(const t of byId.values()){degrees.set(t.id,t.dependsOn.length);for(const d of t.dependsOn){if(!byId.has(d))throw Error('Unknown dependency '+d+' in '+t.id);next.get(d).push(t.id);if(++edges>200000)throw Error('At most 200,000 dependency edges are supported.');}}
 const queue=[...byId.keys()].filter(id=>degrees.get(id)===0);const order=[];
 for(let k=0;k<queue.length;k++){const id=queue[k];order.push(id);for(const child of next.get(id)){degrees.set(child,degrees.get(child)-1);if(degrees.get(child)===0)queue.push(child);}}
 if(order.length!==tasks.length){const color=new Map(),parent=new Map();let cycle=[];
 outer:for(const root of byId.keys()){if(color.has(root))continue;const stack=[{id:root,i:0}];color.set(root,1);
 while(stack.length){const top=stack[stack.length-1],children=next.get(top.id);if(top.i===children.length){color.set(top.id,2);stack.pop();continue;}const v=children[top.i++];if(color.get(v)===1){cycle=[top.id];while(cycle[cycle.length-1]!==v)cycle.push(parent.get(cycle[cycle.length-1]));cycle.reverse();cycle.push(v);break outer;}if(!color.has(v)){parent.set(v,top.id);color.set(v,1);stack.push({id:v,i:0});}}}
 return {version:'1.0',feasible:false,cycle,message:'Dependencies contain a cycle; no valid schedule exists.'};}
 const es=new Map(),ef=new Map(),pre=new Map();let finish=0,end=null;
 for(const id of order){let start=0,previous=null;for(const d of byId.get(id).dependsOn)if(previous===null||ef.get(d)>start){start=ef.get(d);previous=d;}const e=start+byId.get(id).duration;es.set(id,start);ef.set(id,e);pre.set(id,previous);if(end===null||e>finish){finish=e;end=id;}}
 const lf=new Map(),ls=new Map();for(let i=order.length-1;i>=0;i--){const id=order[i];let latest=finish;for(const child of next.get(id))latest=Math.min(latest,ls.get(child));lf.set(id,latest);ls.set(id,latest-byId.get(id).duration);}
 const criticalPath=[];for(let id=end;id!==null;id=pre.get(id))criticalPath.push(id);criticalPath.reverse();
 return {version:'1.0',feasible:true,duration:finish,taskCount:tasks.length,edgeCount:edges,criticalPath,assumptions:'Durations use one consistent unit. Unlimited parallel capacity; no calendars or resource constraints.',tasks:order.map(id=>({...byId.get(id),earliestStart:es.get(id),earliestFinish:ef.get(id),latestStart:ls.get(id),slack:Math.max(0,ls.get(id)-es.get(id)),critical:Math.abs(ls.get(id)-es.get(id))<1e-8}))};
}
export function impact(input,id){const result=plan(input);if(!result.feasible)throw Error('Resolve the dependency cycle first.');if(!result.tasks.some(t=>t.id===id))throw Error('Unknown task.');const children=new Map(result.tasks.map(t=>[t.id,[]]));for(const t of result.tasks)for(const d of t.dependsOn)children.get(d).push(t.id);const seen=new Set([id]),queue=[id];for(let i=0;i<queue.length;i++)for(const x of children.get(queue[i]))if(!seen.has(x)){seen.add(x);queue.push(x);}return queue.slice(1);}
