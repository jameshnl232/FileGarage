import FileBrowser from "../_components/FileBrowser";

export default function FavoritesPage() {

   

  return (
    <div>
      <FileBrowser title="Your Favorites" favoriteOnly={true} />
    </div>
  );
}
