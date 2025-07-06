import React from "react";
import { FaScroll } from "react-icons/fa";
import { generateSeo } from "/config/seo.config";
import SeoStructuredData from "@components/Seo/StructuredData";
import "./page.scss";

export const metadata = generateSeo({
  title: "Algemene Voorwaarden",
  description: "Lees onze algemene voorwaarden voor het huren van een vakantiestudio in Middelkerke bij San Marino 4.",
});

export default function TermsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Algemene Voorwaarden",
    description: "Algemene voorwaarden voor het huren van een vakantiestudio in Middelkerke",
  };

  return (
    <>
      <SeoStructuredData data={structuredData} />
      <main className="terms-page container">
        <h1><FaScroll /> Algemene Voorwaarden</h1>
        
        <div className="terms-content">
          {[
            {
              title: "Reserveren",
              content: `Reserveren kan door het contactformulier te vervolledigen en helft van de huurprijs reeds over te schrijven op rekening (met de verblijfsperiode als vermelding).\nVervolgens wordt jullie reservatie aangeduid op de beschikbaarheidskalender op de website en ontvangt u nog een mailtje ter bevestiging.`
            },
            {
              title: "Betaling",
              content: `Bij reservatie betaal je 50% van de verblijfsom. Uiterlijk 10 dagen voor aankomst betaal je de overige 50% samen met de waarborg van €250 (met de verblijfsperiode als vermelding).`
            },
            {
              title: "Waarborg",
              content: `De borgsom van 250€ zal daags na het verlaten van de woning teruggestort worden op de rekening van waar die werd overgemaakt (uiterst zelden onder eventuele aftrek van kosten van geconstateerde schade).`
            },
            {
              title: "Schoonmaak",
              content: `De huurder zorgt ervoor dat de woning bezemschoon is, alsook voor proper vaatwerk en een lege vaatwas.\nDe verhuurder zorgt voor de verderfelijke eindschoonmaak omdat die ongetwijfeld pretbedervend is.`
            },
            {
              title: "Inchecken",
              content: `De sleutel zal ter plaatse beschikbaar worden gesteld vanaf 16h ofwel op een afgesproken tijdstip.`
            },
            {
              title: "Uitchecken",
              content: `Bij vertrek dient de woning bezemschoon en vrij te zijn tegen 16u.`
            },
            {
              title: "Maximum capaciteit",
              content: `Omwille van zowel wettelijke, brand- als verzekeringstechnische redenen mag de maximum capaciteit niet worden overschreden (max. 10 volwassenen en 2 kinderen van <3j.). De woning is tevens uitsluitend bestemd als vakantieverblijf.`
            },
            {
              title: "Huisdieren",
              content: `Het is ten strengste verboden om tijdens de huurperiode huisdieren in het goed mee te nemen.`
            },
            {
              title: "Rookverbod",
              content: `Roken in de vakantiewoning is verboden. Ook binnen roken met open raam is niet toegelaten omdat rookdetectoren hierdoor onnodig in werking kunnen worden gesteld.`
            },
            {
              title: "Verblijf annuleren",
              content: `Bij annulering vóór de 28e dag voor aankomst zal slechts een administratiekost van maximum 25 euro worden aangerekend.\nBij annulering vanaf de 28e dag voor aankomst zal 50% van de huurprijs worden aangerekend.\nBij annulering vanaf de 2de dag voor aankomst kan de totale kostprijs worden aangerekend.\nDe aanbetaalde som kan hiervoor in rekening gebracht worden en/of ingehouden worden door de verhuurder.\nDe juiste datum hiervan wordt uitsluitend bepaald door de datum van ontvangst van het schriftelijk annuleringsverzoek.`
            },
            {
              title: "Aansprakelijkheid",
              content: `De verhuurder kan niet aansprakelijk worden gesteld voor gebeurlijke ongevallen.\nHuurder verplicht wordt om bij het tijdelijk verlaten van de woning alle ramen en deuren te sluiten.\nDe huurder, zijnde de contactpersoon die reserveerde is ten persoonlijke titel verantwoordelijk al zijn medehuurders.\nVoor elke door huurder veroorzaakte schade aan of verlies van een deel van de inboedel zal de verhuurder het recht hebben de kostprijs ervan in te houden op de door huurder gestorte waarborg of, indien ontoereikend, de kostprijs ervan van de huurder, op welke wijze dan ook, te vorderen.`
            },
            {
              title: "Schade & Waarborg",
              content: `Volgende hinderlijke toestanden kunnen aanleiding geven tot een gedeeltelijk inhouden van de waarborg:\n• Verplaatsen van meubilair\n• Te laat vertrek\n• Geluidsoverlast\n• Overbezetting\n• Roken in huis\n\nErnstige schade moet direct gemeld worden. Kleine schade melden bij vertrek.`
            }
          ].map((term, index) => (
            <section key={index} className="term-section">
              <h2>{term.title}</h2>
              <p>{term.content}</p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}