import FileBrowser from "../_components/FileBrowser";

export default function FilesPage() {
  return (
    <div>
      <FileBrowser title="All files" favoriteOnly={false} />
    </div>
  );
}
