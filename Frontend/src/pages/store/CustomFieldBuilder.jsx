import Modal from "../../components/Modal";
import { QRCodeCanvas } from "qrcode.react";
import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Trash2, FileText, ChevronDown, Calendar, FileUp, QrCode, Edit2, Check, X } from "lucide-react";

export default function CustomFieldBuilder({ 
onClose,
customFields,
onAddField,
onUpdateField,
onDeleteField
}) {
const [fields,setFields] = useState([]);

useEffect(()=>{
setFields(
(customFields || []).map(f=>({
id: f._id,
label: f.name,
fieldType: f.type || "text",
options: f.options || [],
isMandatory: f.required || false
}))
);
},[customFields]);
 
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newField, setNewField] = useState({ label: "", fieldType: "text", isMandatory: false, options: [] });
  const [optionsText, setOptionsText] = useState(""); // For smoother text input
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fieldTypes = [
  { id: "text", label: "Normal Text", icon: <FileText size={12} /> },
  { id: "select", label: "Dropdown", icon: <ChevronDown size={12} /> },
  { id: "date", label: "Date", icon: <Calendar size={12} /> },
  { id: "fileQR", label: "File", icon: <FileUp size={12} /> },
];

  const handleAddField = () => {

if(!newField.label) return;

const optionsArray =
newField.fieldType === "select"
? newField.options.filter(opt=>opt.trim() !== "")
: [];

console.log("SAVING FIELD:",{
label:newField.label,
type:newField.fieldType,
options:optionsArray,
required:newField.isMandatory
});

onAddField(
newField.label,
newField.fieldType,
[...optionsArray],   
newField.isMandatory
);

resetBuilder();

showToast("Field added successfully!");

};

  const startEdit = (field) => {
    setNewField(field);
    setOptionsText(field.options ? field.options.join(", ") : "");
    setEditingId(field.id);
    setShowBuilder(true);
  };

  const handleUpdateField = () => {

if(!newField.label) return;

onUpdateField(editingId,newField.label);

resetBuilder();

showToast("Field updated successfully!");

};

  const handleDelete = (id) => {

onDeleteField(id);

showToast("Field deleted!");

};

  const resetBuilder = () => {
    setNewField({ label: "", fieldType: "text", isMandatory: false, options: [] });
    setOptionsText("");
    setEditingId(null);
    setShowBuilder(false);
  };

  return (
    <Modal
open={true}
onClose={onClose}
title="Custom Field Builder"
width={640}
>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-10 right-10 bg-[#2D3142] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 z-[10001] animate-bounce">
          <div className="bg-green-500 rounded-full p-1"><Check size={14}/></div>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

  {/* COMPACT MODAL CARD */}
  <div
style={{
display:"flex",
flexDirection:"column",
gap:16
}}
>
        {/* Header */}
        <div
style={{
display:"flex",
alignItems:"center",
justifyContent:"space-between",
padding:"20px 24px",
borderBottom:"1.5px solid #eeeef8"
}}
>
  
  <div
style={{
fontSize:17,
fontWeight:700,
color:"#111827"
}}
>
Custom Field Builder
</div>

  <div className="flex items-center gap-3">

    <button 
      onClick={() => { resetBuilder(); setShowBuilder(true); }}
      className="bg-[#7C5CFC] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#6a4ce0]"
    >
      + Add Field
    </button>

    <button 
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 text-lg"
    >
      ✕
    </button>

  </div>

</div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Fields List */}
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field.id || field._id} className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="bg-[#7C5CFC]/10 text-[#7C5CFC] text-[10px] font-bold px-2 py-1 rounded uppercase">
                    {field.fieldType}
                    {field.fieldType==="fileQR" && field.qrToken && (

<div className="mt-2">

<QRCodeCanvas
value={`http://localhost:3000/upload/${field.qrToken}`}
size={80}
/>

<div className="text-[10px] text-gray-400 mt-1">
Scan to upload document
</div>

</div>

)}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#2D3142] font-semibold text-sm">{field.label}</span>
                      {field.docId && <span className="text-gray-400 text-[10px] flex items-center gap-1"><QrCode size={10}/> {field.docId}</span>}
                    </div>
                    {field.options?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {field.options.map((opt, i) => (
                          <span key={i} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px]">{opt}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Required</span>
                    <div className={`w-8 h-4 rounded-full relative transition-colors ${field.isMandatory ? 'bg-green-400' : 'bg-gray-200'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${field.isMandatory ? 'left-4.5' : 'left-0.5'}`} />
                    </div>
                  </div>
                  <button onClick={() => startEdit(field)} className="text-gray-400 hover:text-[#7C5CFC] transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(field.id || field._id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* BUILDER PANEL */}
          {showBuilder && (
            <div className="bg-[#f8f9ff] border border-[#ecebfd] rounded-xl overflow-hidden animate-in slide-in-from-top-2">
              <div className="flex border-b border-[#ecebfd]">
                {fieldTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewField({ ...newField, fieldType: type.id })}
                    className={`flex-1 py-3 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                      newField.fieldType === type.id ? "text-[#7C5CFC] bg-white border-b-2 border-[#7C5CFC]" : "text-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <input
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/20 mb-4"
                  placeholder="Field Label (e.g. Preferred Contact)"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                />

                {newField.fieldType === 'select' && (

<div className="mb-4">

{newField.options.map((opt,i)=>(

<div key={i} className="flex gap-2 mb-2">

<input
className="w-full text-sm p-2 rounded border"
value={opt}
onChange={(e)=>{

const updated=[...newField.options];

updated[i]=e.target.value;

setNewField({
...newField,
options:updated
});

}}
/>

<button
onClick={()=>{

setNewField({
...newField,
options:newField.options.filter((_,index)=>index!==i)
});

}}
className="text-red-500"
>
✕
</button>

  </div>

  ))}

  <button
  onClick={()=>{

  setNewField({
  ...newField,
  options:[...newField.options,""]
  });

  }}
  className="text-xs bg-[#7C5CFC] text-white px-3 py-1 rounded"
  >
  + Add Option
  </button>

  </div>

)}

                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={newField.isMandatory} 
                      onChange={(e) => setNewField({ ...newField, isMandatory: e.target.checked })} 
                    />
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${newField.isMandatory ? 'bg-[#82C491]' : 'bg-gray-300'}`}>
                        <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${newField.isMandatory ? 'translate-x-4.5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-gray-500 text-[11px] font-bold uppercase tracking-tight">Mark as Required</span>
                  </label>

                  <div className="flex gap-2">
                    <button onClick={resetBuilder} className="px-4 py-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase">Cancel</button>
                    <button 
                      onClick={editingId ? handleUpdateField : handleAddField} 
                      className="px-6 py-2 rounded-lg bg-[#7C5CFC] text-white text-[11px] font-bold hover:bg-[#6a4ce0] shadow-lg shadow-[#7C5CFC]/20 uppercase"
                    >
                      {editingId ? "Update Field" : "Save Field"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Action Footer */}
        <div className="p-5 border-t border-gray-100 bg-white flex justify-between items-center sticky bottom-0">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{fields.length} Fields Active</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">Close</button>
            <button 
onClick={onClose}
              className="bg-[#2D3142] text-white px-8 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-black transition-all shadow-xl"
            >
              <Check size={14}/> Save Changes
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
