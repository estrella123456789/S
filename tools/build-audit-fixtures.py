from pathlib import Path
import base64,shutil,zipfile
out=Path('.verification/button-fixtures');out.mkdir(parents=True,exist_ok=True)
for name,text in [('audit.txt','Audit document import\n- Verify source content'),('audit.md','# Audit document import\n- Verify source content'),('audit.csv','title,description\nAudit,Verify source content')]: (out/name).write_text(text,encoding='utf-8')
shutil.copyfile('examples/rules-demo.json',out/'audit.json')
with zipfile.ZipFile(out/'audit.docx','w',zipfile.ZIP_DEFLATED) as z:
 z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
 z.writestr('word/document.xml','<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Audit document import</w:t></w:r></w:p><w:p><w:r><w:t>Verify source content</w:t></w:r></w:p></w:body></w:document>')
source=next(Path('.verification/downloads').glob('*.pptx'));shutil.copyfile(source,out/'audit.pptx')
(out/'audit.png').write_bytes(base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='))
objects=[b'<< /Type /Catalog /Pages 2 0 R >>',b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>']
stream=b'BT /F1 18 Tf 50 700 Td (Audit document import) Tj ET'
objects.append(b'<< /Length '+str(len(stream)).encode()+b' >>\nstream\n'+stream+b'\nendstream')
data=bytearray(b'%PDF-1.4\n');offsets=[0]
for i,obj in enumerate(objects,1):offsets.append(len(data));data.extend(f'{i} 0 obj\n'.encode()+obj+b'\nendobj\n')
xref=len(data);data.extend(f'xref\n0 {len(objects)+1}\n0000000000 65535 f \n'.encode())
for offset in offsets[1:]:data.extend(f'{offset:010} 00000 n \n'.encode())
data.extend(f'trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref}\n%%EOF'.encode());(out/'audit.pdf').write_bytes(data)
print('Created small real file fixtures for all seven import formats.')
