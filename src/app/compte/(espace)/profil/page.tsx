import type { Metadata } from "next";
import { deleteAccount } from "@/app/compte/(espace)/profil/actions";
import { NewPasswordForm } from "@/components/account/new-password-form";
import { EmailForm, ProfileForm } from "@/components/account/profile-forms";
import { requireCustomer } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Mon profil | Droopy's",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const { user, customer } = await requireCustomer("/compte/profil");
  const viaGoogle = user.app_metadata.providers?.includes("google") ?? false;

  return (
    <>
      <section className="account-section">
        <h2 className="account-title">Mon profil</h2>
        <ProfileForm firstName={customer.firstName} lastName={customer.lastName} />
      </section>

      <section className="account-section" aria-labelledby="profil-email-titre">
        <h3 id="profil-email-titre" className="account-subtitle">
          Adresse e-mail
        </h3>
        <EmailForm email={user.email ?? ""} />
      </section>

      <section className="account-section" aria-labelledby="profil-mdp-titre">
        <h3 id="profil-mdp-titre" className="account-subtitle">
          Mot de passe
        </h3>
        {viaGoogle && (
          <p className="text-paragraph m-0">
            Vous vous connectez avec Google. Un mot de passe vous permettra aussi
            de vous connecter avec votre e-mail.
          </p>
        )}
        <NewPasswordForm suite="/compte?motDePasse=modifie" />
      </section>

      <section className="account-section" aria-labelledby="profil-suppression-titre">
        <h3 id="profil-suppression-titre" className="account-subtitle">
          Supprimer mon compte
        </h3>
        <p className="text-paragraph m-0">
          Vos adresses et vos favoris seront effacés. Vos commandes sont
          conservées, comme la loi nous y oblige, mais ne seront plus rattachées
          à un compte.
        </p>
        <form action={deleteAccount} className="content-form">
          <label className="account-checkbox">
            <input type="checkbox" name="confirmation" required />
            Je comprends que cette suppression est définitive.
          </label>
          <button type="submit" className="account-button-outline w-auto self-start">
            Supprimer mon compte
          </button>
        </form>
      </section>
    </>
  );
}
