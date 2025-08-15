import { FileConverter } from "@/components/file-converter"
import Header from "@/components/header"

export default function FileConverterPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 py-12 px-4">
        <FileConverter />
      </div>
    </>
  )
}
