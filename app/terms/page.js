import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const page = () => {
  return (
    <div>
      <Menubar />
      <div className="flex flex-col items-center justify-center  py-18 bg-[#F9F9F9">
        <p className=" text-6xl font-bold">Terms & Conditions</p>
      </div>
      <div class=" flex flex-col gap-6 content-box px-[15%] text-[#888888] mb-10">
        <p className="">
          {`1. GUARDCHECK.COM CC ("GUARDCHECK") provides the information and data
          contained on this website to users (the "USER") subject to the terms
          and conditions set out herein (the "TERMS")`}
        </p>
        <p>
          2. By accessing the website, the USER is deemed to have read,
          understood and accepted the TERMS. GUARDCHECK may at any time amend
          any of the terms and such amendment will supercede and replace any
          previous terms. Each time the USER accesses the website, the USER
          agrees to be bound by the TERMS as amended, from time to time.
        </p>
        <p className="m-0">
          3. The USER may access the website for the following purposes:-
        </p>
        <p className="ml-5">
          1. to record information on a Security Guard employed by the USER;{" "}
          <br />
          {`2. to obtain information and data on a Security Guard that has applied
          for a position at the USER'S business; <br />
          3. to place a CV on the website or to access the CV'S placed on the
          website.`}
        </p>
        <p></p>
        <p>
          {` 4. The USER specifically warrants that it has obtained the necessary
          written consent from its Security Guards that it may list the Security
          Guard's name on the website where that Security Guard has committed an
          offence whilst in the employ of the USER and/or has absconded or his
          services have terminated following disciplinary action and dismissal
          following fair procedure.`}
        </p>
        <p>
          {`5. The USER acknowledges and agrees that the confidential information
          and data shall be utilized by it solely and exclusively for the
          purposes of assisting the USER in the ordinary course of the USER'S
          business from time to time and for no other purpose whatsoever.`}
        </p>
        <p>
          6. The USER shall ensure that any information submitted to GUARDCHECK
          is factual and accurate and does not form part of any dispute between
          the USER and its Security Guard.
        </p>
        <p>
          7. GUARDCHECK may in its absolute discretion verify the accuracy of
          any statement, data or information obtained from the USER.
        </p>
        <p>
          8. The USER shall not utilize any of the information supplied to it
          for use in any litigation or legal dispute without written permission
          first being obtained from an authorized representative of GUARDCHECK.
        </p>
        <p>
          9. Any confidential information shall in no way be construed as an
          opinion of GUARDCHECK and merely reflects a recording of information
          received from various USERS from time to time.
        </p>
        <p>
          10. GUARDCHECK makes no representations or warranties whether express,
          implied or tacit as to the accuracy, completeness or reliability of
          any information or data on the website.
        </p>
        <p>
          11. GUARDCHECK reserves the right to remove any of the information or
          data from the website in its sole discretion.
        </p>
        <p>
          {` 12. To subscribe to the website the USER must complete the online
          application form ("APPLICATION FORM). On receipt of the USER'S
          APPLICATION FORM, GUARDCHECK will take such steps it deems necessary,
          to evaluate the USER'S application and to verify the information about
          the USER. The application process will not be completed until the USER
          has been given an opportunity to review the transaction and correct
          any mistakes or withdraw from the transaction. By clicking on the
          "submit" button the USER is deemed to have submitted an offer to
          subscribe for use of the website and the USER will not be able to
          cancel the subscription prior to expiry of one year from the date of
          acceptance of the application by GUARDCHECK (the "INITIAL PERIOD")
          unless GUARDCHECK expressly agrees thereto. The USER shall thereafter
          be required to renew its application.`}
        </p>
        <p>
          {`13. The USER agrees to pay GUARDCHECK the fees stipulated on the
          website. Payment shall be made by way of Electronic Transfer, direct
          deposit, cheques or credit card. The USER hereby authorizes GUARDCHECK
          to charge the payment for such fees to the USER'S credit card, using
          the credit card information provided in the USER'S application form,
          effective from the date of receipt of the USER'S offer to subscribe.
          The USER hereby agrees that GUARDCHECK will not be obliged to refund
          any payment made by the USER, nor shall theUSER be entitled to reverse
          such payment, for any reason whatsoever. Upon receipt of actual
          payment and acceptance of the Application by GUARDCHECK, the USER
          shall be issued with a password.`}
        </p>
        <p>
          14. By accessing the website, the USER warrants and represents to
          GUARDCHECK that the USER is authorized to do so and has the requisite
          capacity to conclude binding agreements with GUARDCHECK. The USER
          hereby indemnifies GUARDCHECK against any loss, liability, damage or
          expense of whatever nature which GUARDCHECK or any third party may
          suffer which is caused by or attributable to, whether directly or
          indirectly, a breach of theUSER of any of the warranties in this
          clause.
        </p>
        <p>
          15. GUARDCHECK reserves the right at any time to change or discontinue
          without notice, any aspect or feature of the website and any service,
          information, data and/or content on the website.
        </p>
        <p>
          16. GUARDCHECK reserves the right not to accept and/or comply with the
          offer to subscribe for any reason whatsoever on notice to the USER.
          The USER hereby confirms and agrees that the transaction between the
          USER and GUARDCHECK will be deemed to have been concluded at the place
          where and at the time when GUARDCHECK accepts the subscription and
          issues the USER with a password regardless of where or when such
          acceptance comes to the notice of the USER.
        </p>
        <p className="m-0">17. The USER agrees and acknowledges that:-</p>
        <p className="ml-5">
          1. it shall keep and maintain as strictly confidential all the
          confidential information furnished to it pursuant to this agreement;{" "}
          <br />
          2. it will use its utmost efforts and diligence to guard and protect
          the confidential information; <br />
          3. it shall use all reasonable efforts to protect the interest of
          GUARDCHECK and shall exercise reasonable care in restricting access of
          the confidential information to its officers, directors, and
          authorised employees.
        </p>
        <p></p>
        <p className="m-0">18. The USER acknowledges and agrees that:-</p>
        <p className="ml-5">
          1. GUARDCHECK does not make any representation, as to the accuracy or
          correctness of any confidential information transmitted to or made
          available to the USER; <br />
          2. Without derogating from the generality of the provisions of
          paragraph 18.1 above, GUARDCHECK shall not be liable for any loss,
          liability, expense or damage of whatsoever nature suffered by the USER
          or any other person as a result of or which may be attributable to -
        </p>
        <p className="ml-5">
          * the use by the USER or any other person of any of the confidential
          information in any manner whatsoever and the dissemination of the
          information to third parties by the USER or any other person; <br />
          * any mistake, error or omission in any of the confidential
          information; <br />
          * any delay in delivering or in any manner communicating the
          confidential information to the USER; <br />* any failure to deliver
          or in any manner communicate the confidential information to the USER.
        </p>
        <p></p>
        <p></p>
        <p className="ml-5">
          3. The USER indemnifies GUARDCHECK against any claim which may be made
          against GUARDCHECK by any third party in respect of any matter arising
          from this agreement.
        </p>
        <p>
          {`19. External links may be provided, but they are beyond the control of
          GUARDCHECK and no representation is made as to their content. Use or
          reliance on any external links provided is at the USER'S own risk. No
          links shall be created from any website controlled by the USER or
          otherwise to this website without the express prior written permission
          of GUARDCHECK.`}
        </p>
        <p>20.</p>
        <p className="ml-5">
          1. The Terms as amended from time to time and the application form
          constitute the sole record of the agreement between the USER and
          GUARDCHECK in relation to the subject matter hereof. Neither the USER
          nor GUARDCHECK shall be bound by any express, tacit or implied
          representation, warranty, promise or the like not recorded herein.
          These terms and conditions take precedence over and replace all prior
          commitments, undertakings or representations, whether written or oral,
          between the USER and GUARDCHECK in respect of the subject matter
          hereof. No indulgence or extension of time which either the USER or
          GUARDCHECK may grant to the other will constitute a waiver of or limit
          any of the existing or future rights of the grantor in terms hereof,
          save in the event or to the extent that the grantor has signed a
          written document expressly waiving or limiting such rights. <br />
          2. GUARDCHECK shall be entitled to cede, assign and delegate all or
          any of its rights and obligations in terms of this Agreement. The USER
          shall not be entitled to cede, assign and delegate all or any of its
          rights and obligations in terms of this Agreement.
          <br />
          3. All provisions of these terms and conditions are, notwithstanding
          the manner in which they have been grouped together or linked
          grammatically, severable from each other. Any provision of these terms
          and conditions which is or becomes unenforceable in any jurisdiction,
          whether due to voidness, invalidity, illegality, unlawfulness or for
          any reason whatsoever, shall, in such jurisdiction only and only to
          the extent that it is so unenforceable, be treated as pro non scripto
          and the remaining provisions of these terms and conditions shall
          remain in full force and effect.
          <br />
          {`4. Should GUARDCHECK be prevented from fulfilling any of its
          obligations hereunder as a result of any event beyond its control,
          then those obligations shall be deemed to have been suspended to the
          extent that and for as long as GUARDCHECK is so prevented from
          fulfilling them and the USER'S corresponding obligations shall be
          suspended to the corresponding extent. If the event continues for more
          than fourteen days after it has first occurred then GUARDCHECK shall
          be entitled (but not obliged) to terminate all of its rights and
          obligations in terms of or arising out of these terms by giving notice
          to the USER.`}
          <br />
          5. These terms shall be governed by and construed in accordance with
          the laws of the Republic of South Africa. The USER hereby consents and
          submits to the exclusive jurisdiction of the Witwatersrand Local
          Division of the High Court of South Africa in respect of any disputes
          arising in connection with any matter related to or in connection with
          this Agreement.
        </p>
        <p></p>
        <p className="m-0">
          {`21. In compliance with Section 43(1) of the Electronic Communications
          and Transactions Act 25 of 2002 ("ECTA"), your attention is drawn to
          the following:-`}
        </p>
        <p className="ml-5">
          1. Full name and legal status: GUARDCHECK (Pty) Ltd, a Private Company
          in accordance with the laws of the Republic of South Africa;
          <br />
          2. Registration Number: 2015/153278/07;
          <br />
          3. Place of registration: Pretoria, South Africa;
          <br />
          4. Registered address 118 Jack Nicklause Drive Pecanwood Estate
          Broederstroom 0240;
          <br />
          5. Telephone Number: (012)492-9089;
          <br />
          6. Website address: www.guardcheck.com;
          <br />
          7. E-mail address: info@guardcheck.com;
          <br />
          8. Physical address 118 Jack Nicklaus Drive Pecanwood Circle Pecanwood
          Estate Broederstroom 0240;
          <br />
          9. Description of main characteristics of the service/s offered by
          GUARDCHECK (View Brochures -Hyperlink)
          <br />
          10. Manner of payment: electronically by credit card, electronic bank
          transfer, direct bank deposit or cheque;
          <br />
          11. The terms of the agreement: The terms of the Agreement between the
          USER and GUARDCHECK is governed by these terms, the application form
          and GUARDCHECK makes no representations and gives no warranties and/or
          guarantees of whatsoever nature, whether express, implied in law or
          tacit, in respect of these terms, the service/s and/or the accuracy or
          correctness of the information delivered to the USER or any part
          thereof;
          <br />
          {`12. Time within which the services will be delivered: As soon as is
          reasonably possible after GUARDCHECK accepts the USER'S application
          and issues the USER with a password;`}
          <br />
          13. Return and refund policy: By nature of the service/s, no
          information or data provided to the USER by GUARDCHECK may be
          returned, and no monies paid by the USER to GUARDCHECK in respect of
          the service/s will be refunded to the USER;
          <br />
          14. Security Procedures and Privacy Policy of GUARDCHECK in respect of
          payment, payment information and personal information: GUARDCHECK
          utilises a payment system that is sufficiently secure with reference
          to accepted technological standards as at the date of these terms,
          given the type of transaction to be concluded between the USER and
          GUARDCHECK;
          <br />
          15. Cooling-off period: In terms of Section 42(2)(f)(iii) of ECTA, no
          cooling-off period applies in respect of any service/s or information
          accessed via the website, as the information accessed and delivered to
          the USER by GUARDCHECK cannot be returned.
        </p>
        <p></p>
        <p>
          22. No person, business or website may frame the site of GUARDCHECK or
          any of the pages on this site in any way whatsoever.
        </p>
        <p>
          {`23. No person, business or website may use any technology to search
          and/or gain information from GUARDCHECK'S website without its prior
          written consent.`}
        </p>
        <p className="m-0">
          24. The address for service for all purposes relating to these terms
          of use including the giving of any notice, the payment of any sum, the
          serving of any process, is:
        </p>
        <p className="ml-5">
          1. Physical Address: 118 Jack Nicklaus Drive Pecanwood Circle
          Pecanwood Estate Broederstroom 0240;
          <br />
          2. No legal service shall be validly affected by e-mail;
          <br />
          3. GUARDCHECK shall be entitled from time to time, by giving notice to
          the USER to vary its physical address for service to any other
          physical address within the Republic of South Africa, and to vary its
          facsimile address for service to any other facsimile number;
          <br />
          4. The USER nominates the physical and facsimile address set out in
          the APPLICATION FORM as its domicilium citandi etexecutandi.
        </p>
        <p></p>
        <p className="m-0">
          25. Detailed description of goods and our services.
        </p>
        <p className="ml-5">
          Guardcheck is a business in the security industry that provides a
          service in checking for blacklisted security guards.
        </p>
        <p></p>
        <p className="m-0">26. Delivery policy.</p>
        <p className="ml-5">
          Subject to availability and receipt of payment,requests will be
          processed immediately.
          <br />
          (For account activation)
        </p>
        <p></p>
        <p className="m-0">27. Export restriction.</p>
        <p className="ml-5">
          The offering on this website is available to South African clients
          only.
        </p>
        <p></p>
        <p className="m-0">28. Return and Refunds policy.</p>
        <p className="ml-5">
          The provision of goods and services by Guardcheck is subject to
          availability.In cases of unavailability,Guard check will refund the
          client in full with in 30 days. Cancellation of accounts by the client
          will attract a 20% administration fee.
        </p>
        <p></p>
        <p className="m-0">29. Customer Privacy policy.</p>
        <p className="ml-5">
          {`Guard check shall take all reasonable steps to protect the personal
          information of users. For the purpose of this clause, "personal
          information" shall be defined as detailed in the Promotion of Access
          to Information Act 2 of 2000 (PAIA). The PAIA may be downloaded from:
          http://www.polity.org.za/attachment.php?aa_id=3569.`}
        </p>
        <p></p>
        <p className="m-0">30. Payment options accepted.</p>
        <p className="ml-5">
          Payment may be made via Visa, MasterCard, Diners or American Express
          credit cards or by bank transfer in to the Guardcheck bank account,the
          details of which will be provided on request.
        </p>
        <p></p>
        <p className="m-0">31. Credit card acquiring ands ecurity.</p>
        <p className="ml-5">
          Credit card transactions will be acquired for Guardcheck via
          PayGate(Pty) Ltd who are the approved payment gateway for all South
          African Acquiring Banks. PayGate uses the strictest form of
          encryption, namely Secure Socket Layer3 (SSL3)and no credit card
          details are stored on the website.Users may go to www.paygate.co.za to
          view their security certificate and security policy.
        </p>
        <p></p>
        <p className="m-0">32. Customer details separate from card details.</p>
        <p className="ml-5">
          Customer details will be stored by Guardcheck separately from card
          details which are entered by the client on PayGate’s securesite.Form
          oredetailon PayGate refer to www.paygate.co.za.
        </p>
        <p></p>
        <p className="m-0">
          33. Merchant Out let country and transaction currency.
        </p>
        <p className="ml-5">
          The merchant out let country at the time of presenting payment options
          to the card holder is South Africa. Transaction currency is South
          African Rand(ZAR).
        </p>
        <p></p>
        <p className="m-0">34. Responsibility.</p>
        <p className="ml-5">
          Guardcheck takes responsibility for all aspects relating to the
          transaction including sale of goods and services sold on this website,
          customer service and support, disputere solution and delivery of
          goods.
        </p>
        <p></p>
        <p className="m-0">35. Country of domicile.</p>
        <p className="ml-5">
          This website is governed by the laws of South Africa and Guardcheck
          chooses as its domicilium citandi etexecutandi for all purposes under
          this agreement, whether in respect of court process,notice,or other
          documents or communication of what so ever nature.
        </p>
        <p></p>
        <p className="m-0">36. Variation.</p>
        <p className="ml-5">
          Guardcheck may, in its sole discretion, change this agreement or any
          part there of at any time without notice.
        </p>
        <p></p>
        <p></p>
        <p className="m-0">37. Guardcheck contact details.</p>
        <p className="ml-5">
          Postnet Suite 103 , Private Bag X0003, Ifafi, 0260
        </p>
        <p></p>
      </div>
      <Footer />
    </div>
  );
};

export default page;
