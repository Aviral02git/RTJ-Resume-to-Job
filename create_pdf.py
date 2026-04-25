from fpdf import FPDF
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=15)
pdf.cell(200, 10, txt="Akhilesh Kumar - Software Engineer", ln=1, align="C")
pdf.cell(200, 10, txt="Experience: 5 years in Node.js, React, and Python.", ln=2, align="L")
pdf.cell(200, 10, txt="Skills: JavaScript, TypeScript, Docker, Kubernetes, AWS.", ln=3, align="L")
pdf.cell(200, 10, txt="Education: B.Tech in Computer Science.", ln=4, align="L")
pdf.output("real_sample.pdf")
