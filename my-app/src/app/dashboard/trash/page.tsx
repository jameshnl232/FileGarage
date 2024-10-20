import FileBrowser from "../_components/FileBrowser";

export default function TrashPage() {
  return (
    <div>
      <FileBrowser title="All files" favoriteOnly={false} deletedOnly={true} />
    </div>
  );
}
