// Client-side PDF generation using jsPDF
// Dynamically imported to avoid SSR bundle inclusion

interface ParsedBlock {
  type: 'cover' | 'h1' | 'h2' | 'h3' | 'paragraph' | 'bullet' | 'divider' | 'blank'
  text: string
}

function parseMarkdown(md: string): ParsedBlock[] {
  const lines = md.split('\n')
  const blocks: ParsedBlock[] = []

  for (const raw of lines) {
    const line = raw.trimEnd()

    if (/^# /.test(line)) {
      blocks.push({ type: 'h1', text: line.replace(/^# /, '').trim() })
    } else if (/^## /.test(line)) {
      blocks.push({ type: 'h2', text: line.replace(/^## /, '').trim() })
    } else if (/^### /.test(line)) {
      blocks.push({ type: 'h3', text: line.replace(/^### /, '').trim() })
    } else if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'divider', text: '' })
    } else if (/^[-*+] /.test(line)) {
      const text = line.replace(/^[-*+] /, '').trim()
      blocks.push({ type: 'bullet', text: stripInlineMarkdown(text) })
    } else if (line.trim() === '') {
      blocks.push({ type: 'blank', text: '' })
    } else {
      blocks.push({ type: 'paragraph', text: stripInlineMarkdown(line.trim()) })
    }
  }

  return blocks
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/^> /, '')
    .trim()
}

// Extract a clean title from the first H1 in the markdown, or fall back to provided title
function extractTitle(md: string, fallback: string): string {
  const match = md.match(/^# (.+)$/m)
  return match ? match[1].trim() : fallback
}

export async function downloadEbookPDF(
  markdown: string,
  projectTitle: string,
  creatorName?: string
) {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageW = 210
  const pageH = 297
  const marginL = 22
  const marginR = 22
  const marginT = 22
  const marginB = 28
  const contentW = pageW - marginL - marginR

  const NAVY = [27, 42, 74] as const
  const NAVY_LIGHT = [45, 66, 112] as const
  const GOLD = [198, 160, 78] as const
  const BODY = [55, 65, 81] as const
  const MUTED = [107, 114, 128] as const
  const WHITE = [255, 255, 255] as const

  let currentY = marginT
  let currentPage = 1

  function setColor(rgb: readonly [number, number, number]) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2])
  }

  function setFill(rgb: readonly [number, number, number]) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2])
  }

  function addFooter(pageNum: number) {
    const prevFontSize = doc.getFontSize()
    doc.setFontSize(8)
    setColor(MUTED)
    doc.setFont('helvetica', 'normal')

    // Left: creator
    if (creatorName) doc.text(creatorName, marginL, pageH - 10)
    // Center: page number
    doc.text(`${pageNum}`, pageW / 2, pageH - 10, { align: 'center' })
    // Right: PillarBloom
    doc.text('pillarbloom.com', pageW - marginR, pageH - 10, { align: 'right' })

    // Footer line
    doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2])
    doc.setLineWidth(0.3)
    doc.line(marginL, pageH - 14, pageW - marginR, pageH - 14)

    doc.setFontSize(prevFontSize)
  }

  function ensureSpace(needed: number): void {
    if (currentY + needed > pageH - marginB - 14) {
      addFooter(currentPage)
      doc.addPage()
      currentPage++
      currentY = marginT + 10
    }
  }

  // ── COVER PAGE ───────────────────────────────────────────────────────────────

  // Navy background
  setFill(NAVY)
  doc.rect(0, 0, pageW, pageH, 'F')

  // Accent rectangle (top strip)
  setFill(GOLD)
  doc.rect(0, 0, pageW, 3, 'F')

  // Gold vertical accent bar
  setFill(GOLD)
  doc.rect(marginL, 55, 3, 70, 'F')

  // "EBOOK" label
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  setColor([198, 160, 78])
  doc.text('EBOOK', marginL + 10, 60)

  // Title
  const displayTitle = extractTitle(markdown, projectTitle)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  setColor(WHITE)
  const titleLines = doc.splitTextToSize(displayTitle, contentW - 12)
  doc.text(titleLines, marginL + 10, 73)

  const titleBottom = 73 + titleLines.length * 11

  // Divider line
  doc.setDrawColor(GOLD[0], GOLD[1], GOLD[2])
  doc.setLineWidth(0.5)
  doc.line(marginL + 10, titleBottom + 8, marginL + 80, titleBottom + 8)

  // Creator name
  if (creatorName) {
    doc.setFontSize(13)
    doc.setFont('helvetica', 'normal')
    setColor([198, 160, 78])
    doc.text(`By ${creatorName}`, marginL + 10, titleBottom + 18)
  }

  // Generation date
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  setColor([107, 114, 128])
  doc.text(dateStr, marginL + 10, titleBottom + 28)

  // PillarBloom branding (bottom)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  setColor(GOLD)
  doc.text('PillarBloom', marginL, pageH - 22)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setColor([107, 114, 128])
  doc.text('AI-powered content & product creation', marginL, pageH - 16)
  doc.text('pillarbloom.com', pageW - marginR, pageH - 16, { align: 'right' })

  // ── CONTENT PAGES ────────────────────────────────────────────────────────────

  doc.addPage()
  currentPage = 2
  currentY = marginT + 10

  const blocks = parseMarkdown(markdown)
  let blankCount = 0

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]

    if (block.type === 'blank') {
      blankCount++
      if (blankCount <= 1) currentY += 4
      continue
    }
    blankCount = 0

    if (block.type === 'divider') {
      ensureSpace(8)
      doc.setDrawColor(MUTED[0], MUTED[1], MUTED[2])
      doc.setLineWidth(0.3)
      doc.line(marginL, currentY, pageW - marginR, currentY)
      currentY += 8
      continue
    }

    if (block.type === 'h1') {
      // H1 always starts a new page (chapter break)
      if (currentY > marginT + 20) {
        addFooter(currentPage)
        doc.addPage()
        currentPage++
        currentY = marginT + 10
      }

      // Chapter number / label
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      setColor(GOLD)
      doc.text('CHAPTER', marginL, currentY)
      currentY += 6

      // Gold accent bar
      setFill(GOLD)
      doc.rect(marginL, currentY, 30, 1.5, 'F')
      currentY += 6

      // H1 text
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      setColor(NAVY)
      const lines = doc.splitTextToSize(block.text, contentW)
      doc.text(lines, marginL, currentY)
      currentY += lines.length * 9 + 8
      continue
    }

    if (block.type === 'h2') {
      ensureSpace(18)
      // Subtle navy background pill
      doc.setFontSize(15)
      doc.setFont('helvetica', 'bold')
      setColor(NAVY)
      const lines = doc.splitTextToSize(block.text, contentW)
      doc.text(lines, marginL, currentY)
      // Gold underline
      setFill(GOLD)
      doc.rect(marginL, currentY + 2, 20, 1, 'F')
      currentY += lines.length * 7 + 7
      continue
    }

    if (block.type === 'h3') {
      ensureSpace(12)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      setColor(NAVY_LIGHT)
      const lines = doc.splitTextToSize(block.text, contentW)
      doc.text(lines, marginL, currentY)
      currentY += lines.length * 6 + 5
      continue
    }

    if (block.type === 'bullet') {
      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'normal')
      setColor(BODY)
      const bulletText = doc.splitTextToSize(block.text, contentW - 8)
      ensureSpace(bulletText.length * 5.5 + 3)

      // Bullet dot
      setFill(GOLD)
      doc.circle(marginL + 1.5, currentY - 1.2, 1, 'F')

      doc.text(bulletText, marginL + 6, currentY)
      currentY += bulletText.length * 5.5 + 2
      continue
    }

    if (block.type === 'paragraph') {
      // Skip if this is just the H1 repeated (first line often is)
      if (block.text.length < 3) continue

      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'normal')
      setColor(BODY)
      const lines = doc.splitTextToSize(block.text, contentW)
      ensureSpace(lines.length * 5.5 + 4)
      doc.text(lines, marginL, currentY)
      currentY += lines.length * 5.5 + 4
      continue
    }
  }

  // Final page footer
  addFooter(currentPage)

  // Save
  const filename = projectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  doc.save(`${filename}-ebook.pdf`)
}
