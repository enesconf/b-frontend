import{r as t,j as e,L as P}from"./index-CccsQzu4.js";import{q as y,_ as b,F as C,p as N,P as k,L as S,a as F}from"./project-DDtakXrc.js";function E({title:c,titleId:i,...f},m){return t.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:m,"aria-labelledby":i},f),c?t.createElement("title",{id:i},c):null,t.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"}))}const L=t.forwardRef(E);function $({isOpen:c,onClose:i,onSuccess:f}){const[m,h]=t.useState(!1),[r,a]=t.useState(null),[l,x]=t.useState(null),g=async u=>{u.preventDefault(),a(null),h(!0);try{const w=u.currentTarget.querySelector('input[name="name"]').value.trim();if(!w){a({field:"name",message:"Please enter a project name"});return}if(!l){a({field:"video",message:"Please select a video file"});return}if(console.log("File details:",{name:l.name,type:l.type,size:l.size}),!l.type.startsWith("video/")){a({field:"video",message:"Please select a valid video file"});return}const j=new FormData;j.append("name",w),l&&j.append("video",l,l.name),console.log("Form data entries:");for(let[d,p]of j.entries())console.log(`${d}: ${p instanceof File?`File(${p.name}, ${p.type})`:p}`);try{const d=await N.createProject(j);console.log("Project created:",d),f(),i()}catch(d){console.error("API Error:",d),d.response?(console.error("Response data:",d.response.data),a({message:d.response.data.detail||"Failed to create project"})):a({message:"Failed to create project"});return}}catch(n){console.error("Form submission error:",n),n instanceof k?a({message:n.message}):a({message:"An unexpected error occurred. Please try again."})}finally{h(!1)}},s=u=>{var v;const n=(v=u.target.files)==null?void 0:v[0];if(a(null),!n){x(null),a({field:"video",message:"Please select a video file"});return}if(console.log("Selected file:",{name:n.name,type:n.type,size:n.size}),!n.type.startsWith("video/")){x(null),a({field:"video",message:"Please select a valid video file"});return}x(n)},o=u=>(r==null?void 0:r.field)===u?r.message:"";return e.jsx(y,{appear:!0,show:c,as:t.Fragment,children:e.jsxs(b,{as:"div",className:"relative z-10",onClose:i,children:[e.jsx(y.Child,{as:t.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"ease-in duration-200",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 bg-black bg-opacity-25"})}),e.jsx("div",{className:"fixed inset-0 overflow-y-auto",children:e.jsx("div",{className:"flex min-h-full items-center justify-center p-4 text-center",children:e.jsx(y.Child,{as:t.Fragment,enter:"ease-out duration-300",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"ease-in duration-200",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsxs(b.Panel,{className:"w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",children:[e.jsxs(b.Title,{as:"div",className:"flex justify-between items-center",children:[e.jsx("h3",{className:"text-lg font-medium leading-6 text-gray-900",children:"Create New Project"}),e.jsx("button",{type:"button",className:"text-gray-400 hover:text-gray-500",onClick:i,children:e.jsx(C,{className:"h-6 w-6"})})]}),e.jsxs("form",{onSubmit:g,className:"mt-4 space-y-4",children:[r&&!r.field&&e.jsx("div",{className:"rounded-md bg-red-50 p-4",children:e.jsx("div",{className:"text-sm text-red-700",children:r.message})}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"name",className:"block text-sm font-medium text-gray-700",children:"Project Name"}),e.jsx("input",{type:"text",name:"name",id:"name",required:!0,className:`mt-1 input ${o("name")?"border-red-500":""}`,placeholder:"Enter project name"}),o("name")&&e.jsx("p",{className:"mt-1 text-sm text-red-600",children:o("name")})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"video",className:"block text-sm font-medium text-gray-700",children:"Main Video"}),e.jsx("input",{type:"file",name:"video",id:"video",accept:"video/*",required:!0,onChange:s,className:`mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        ${o("video")?"border-red-500":""}`}),o("video")&&e.jsx("p",{className:"mt-1 text-sm text-red-600",children:o("video")})]}),e.jsxs("div",{className:"mt-6 flex justify-end space-x-3",children:[e.jsx("button",{type:"button",className:"btn btn-secondary",onClick:i,disabled:m,children:"Cancel"}),e.jsx("button",{type:"submit",className:"btn btn-primary",disabled:m,children:m?e.jsxs("span",{className:"flex items-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Creating..."]}):"Create Project"})]})]})]})})})})]})})}function M(){const[c,i]=t.useState([]),[f,m]=t.useState(!0),[h,r]=t.useState(""),[a,l]=t.useState(!1),x=async()=>{try{const s=await N.getProjects();i(s),r("")}catch(s){r(s.message||"Failed to load projects")}finally{m(!1)}};t.useEffect(()=>{x()},[]);const g=async s=>{if(window.confirm("Are you sure you want to delete this project?"))try{await N.deleteProject(s),i(c.filter(o=>o.id!==s)),r("")}catch(o){r(o.message||"Failed to delete project")}};return e.jsxs(S,{children:[e.jsxs("div",{className:"sm:flex sm:items-center",children:[e.jsxs("div",{className:"sm:flex-auto",children:[e.jsx("h1",{className:"text-2xl font-semibold text-gray-900",children:"Projects"}),e.jsx("p",{className:"mt-2 text-sm text-gray-700",children:"Create and manage your interactive video projects"})]}),e.jsx("div",{className:"mt-4 sm:mt-0 sm:ml-16 sm:flex-none",children:e.jsxs("button",{type:"button",onClick:()=>l(!0),className:"btn btn-primary inline-flex items-center",children:[e.jsx(F,{className:"h-5 w-5 mr-2"}),"New Project"]})})]}),h&&e.jsx("div",{className:"mt-6 rounded-md bg-red-50 p-4",children:e.jsx("div",{className:"text-sm text-red-700",children:h})}),f?e.jsx("div",{className:"mt-6 text-center text-gray-500",children:"Loading projects..."}):c.length===0?e.jsxs("div",{className:"mt-6 text-center",children:[e.jsx(L,{className:"mx-auto h-12 w-12 text-gray-400"}),e.jsx("h3",{className:"mt-2 text-sm font-medium text-gray-900",children:"No projects"}),e.jsx("p",{className:"mt-1 text-sm text-gray-500",children:"Get started by creating a new project."}),e.jsx("div",{className:"mt-6",children:e.jsxs("button",{type:"button",onClick:()=>l(!0),className:"btn btn-primary inline-flex items-center",children:[e.jsx(F,{className:"h-5 w-5 mr-2"}),"New Project"]})})]}):e.jsx("div",{className:"mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",children:c.map(s=>e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"aspect-w-16 aspect-h-9 mb-4",children:e.jsx("video",{src:s.main_video_url,className:"rounded-lg object-cover"})}),e.jsx("h3",{className:"text-lg font-medium text-gray-900",children:s.name}),e.jsxs("div",{className:"mt-4 flex justify-between items-center",children:[e.jsx(P,{to:`/projects/${s.id}`,className:"text-blue-600 hover:text-blue-500",children:"View Details"}),e.jsx("button",{onClick:()=>g(s.id),className:"text-red-600 hover:text-red-500",children:"Delete"})]})]},s.id))}),e.jsx($,{isOpen:a,onClose:()=>l(!1),onSuccess:x})]})}export{M as default};
//# sourceMappingURL=Dashboard-hR5VXnOO.js.map