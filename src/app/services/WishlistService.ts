/**
 * Wishlist & Product Like Service for AgroOlam
 * Handles persistent liking/unliking with localStorage and reactive event dispatching.
 */

const LIKES_KEY = "agroolam_liked_products";

class WishlistService {
  public static getLikedIds(): string[] {
    try {
      const data = localStorage.getItem(LIKES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static isLiked(productId: string): boolean {
    const list = this.getLikedIds();
    return list.includes(productId);
  }

  public static toggleLike(productId: string): { isLiked: boolean; countDelta: number } {
    const list = this.getLikedIds();
    const index = list.indexOf(productId);
    let isLiked = false;
    let countDelta = 0;

    if (index >= 0) {
      list.splice(index, 1);
      isLiked = false;
      countDelta = -1;
    } else {
      list.push(productId);
      isLiked = true;
      countDelta = 1;
    }

    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(list));
      window.dispatchEvent(
        new CustomEvent("agroolam_wishlist_updated", {
          detail: { productId, isLiked },
        })
      );
    } catch (e) {
      console.warn("Could not save wishlist to localStorage", e);
    }

    return { isLiked, countDelta };
  }
}

export default WishlistService;

