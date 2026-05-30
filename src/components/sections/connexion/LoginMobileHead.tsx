import { VigiScale } from "./VigiScale";
import { TrustChips } from "./login-trust";

/**
 * En-tête marine compact, visible uniquement < 900px (le panneau marque desktop
 * est alors masqué). `aria-hidden` pour ne pas dupliquer la marque auprès des
 * lecteurs d'écran : le contexte est porté par le <h1> « Espace CETé » du formulaire.
 */
export function LoginMobileHead() {
  return (
    <div className="mobile-head" aria-hidden="true">
      <div className="bubbles">
        <span className="bubble b1" />
        <span className="bubble b3" />
      </div>
      <div className="mh-row">
        <span className="wordmark">
          CET<sup>é</sup>
        </span>
        <VigiScale className="mh-scale" />
      </div>
      <p className="mh-sub">
        Organisme indépendant de notation du risque électrique.
      </p>
      <div className="mh-trust">
        <TrustChips />
      </div>
    </div>
  );
}
