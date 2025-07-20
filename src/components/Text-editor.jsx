import { useRef, useEffect, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import { setDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import "react-quill/dist/quill.snow.css";
import "../App.css";
import { debounce } from "lodash";
import  html2pdf  from "html2pdf.js";



export const TextEditor = () => {
  const quillRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const isLocalChange = useRef(false);

  const documentRef = doc(db, "documents", "sample-doc");

  const saveContent = useCallback(
    debounce(() => {
      if (quillRef.current) {
        const content = quillRef.current.getEditor().getContents();
        const plainContent = content.ops;

        console.log("Saving content to Firestore:", plainContent);

        setDoc(documentRef, { content: plainContent }, { merge: true })
          .then(() => console.log("Content saved successfully"))
          .catch(console.error);

        isLocalChange.current = false;
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (quillRef.current) {
      // Load initial content from Firestore
      getDoc(documentRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const savedContent = docSnap.data().content || [];
            if (Array.isArray(savedContent)) {
              quillRef.current.getEditor().setContents({ops : savedContent});
            } else {
              console.warn("Invalid content format in Firestore. Resetting editor.");
              quillRef.current.getEditor().setContents({ ops: [] });
            }
          } else {
            console.log("No doc found. Starting with empty editor.");
          }
        })
        .catch(console.error);

      // Realtime update listener
      const unsubscribe = onSnapshot(documentRef, (snapshot) => {
  if (snapshot.exists()) {
    const newContent = snapshot.data().content || [];

    // ✅ Check if newContent is a plain array (since you saved only ops)
    if (Array.isArray(newContent)) {
      if (!isEditing) {
        const editor = quillRef.current.getEditor();
        const currentCursorPosition = editor.getSelection()?.index || 0;

        editor.setContents({ ops: newContent }, "silent");
        editor.setSelection(currentCursorPosition);
      }
    } else {
      console.warn("Invalid content format in Firestore snapshot.");
    }
  }
});

      // Local text changes listener
      const editor = quillRef.current.getEditor();
      const handleTextChange = (delta, oldDelta, source) => {
        if (source === "user") {
          isLocalChange.current = true;
          setIsEditing(true);
          saveContent();
          setTimeout(() => setIsEditing(false), 1000);
        }
      };

      editor.on("text-change", handleTextChange);

      return () => {
        unsubscribe();
        editor.off("text-change", handleTextChange);
      };
    }
  }, []);


  // for exporint data to pdf
  const ExportAsPDF = () =>{
    const editor = quillRef.current.getEditor()
    const html = editor.root.innerHTML;

    const options = {
      margin: 0.5,
      filename: 'document.pdf',
      image : {type:'jpeg', quality: 0.98},
      html2canvas: {scale : 2},
      jsPDF : {unit: 'in', formate:'letter', orientation:'portrait'}

    };

    html2pdf().from(html).set(options).save();
  }




  return (
    <div className="google-docs-editor">
      <ReactQuill ref={quillRef} />
      <button onClick={ExportAsPDF}>Export as PDF</button>

    </div>
  );
};
