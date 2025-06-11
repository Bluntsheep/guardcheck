import React from "react";
import Menubar from "../components/menubar/menubar";
import Footer from "../components/footer/footer";

const page = () => {
  return (
    <div class="row clearfix">
      <Menubar />
      <Footer />
      {/* <div class="content-column col-lg-6 col-md-12 col-sm-12">
        <div class="inner-column">
          <ul class="accordion-box">
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Who can use this site?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Only a PSIRA registered Security Company in South Africa.
                  </div>
                </div>
              </div>
            </li>

            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Why PSIRA registered?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    All security companies in South Africa must be registered
                    with PSIRA, and have an authenticated PSIRA number issued.
                  </div>
                </div>
              </div>
            </li>

            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                What does it cost to join Guardcheck?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    R 2850.00 per year in advance with no extra hidden costs
                    billed to Guardcheck members.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                What do I get for my membership fee?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    * You can check a security guard to see if the guard has
                    been blacklisted by another company and the reason for the
                    listing.
                    <br />
                    * You also have the facility to blacklist security guards as
                    a Guardcheck Member. <br />* You will receive a database of
                    CVs from Guards looking for jobs online with their Grade
                    information.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Do I pay extra for blacklisting and receiving reports on
                security guards?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    No, you pay a once-off fee of R1 550.00 per year and receive
                    all features available to you at any time as a registered
                    Guardcheck member.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Do I pay to print CVs from Guardcheck?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    No, it is included in your R1 550.00 membership fee.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Will I be billed automatically after one year?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    No, our website will send an alert that your membership is
                    coming to an end, and will ask if our member would like to
                    renew.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                How do I pay? <br /> There are 2(Two) options for payment:-
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    * By credit card - you will receive your membership and
                    password immediately via e-mail. <br /> * Internet transfer
                    - information must be e-mailed to info@guardcheck.com and
                    your membership and password will be forwarded to your
                    address.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Who can blacklist security guards?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Any member of Guardcheck can and will be allowed to
                    blacklist a security guard following fair disciplinary
                    procedures.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                How long will the security guard be listed?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    The security guard will be listed for (5) Five years, or
                    until the Guardcheck member who listed the security guard
                    removes the guard from the blacklist database.
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="content-column col-lg-6 col-md-12 col-sm-12">
        <div class="inner-column">
          <ul class="accordion-box">
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Can the security guard be removed from the blacklist?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Yes, but only by our Guardcheck member that listed the
                    security guard.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Does a company have to attach a security officer listing report
                to the security guard's letter of employment?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Yes, this makes the security guard aware of their actions
                    and that there are consequences now.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                How do I get a security officer's listing report?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    It is available to our Guardcheck members only, and can be
                    printed off our website. Due to the regulations set by PSIRA
                    the acceptance letter is not available for public download.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block  wow fadeInUp animated"
              style="visibility: visible; animation-name: fadeInUp;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                How long does the security guard CV's stay on the website?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    CVs stay live for 3(Three) months then are automatically
                    removed off Guardcheck's database.
                  </div>
                </div>
              </div>
            </li>

            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                Can a guard re-submit their CV if after 3(Three) months they
                still have not secured employment?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">Yes.</div>
                </div>
              </div>
            </li>

            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                What is the cost for uploading your CV to Guardcheck?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Free of charge, as a security guard can re-enter their CV as
                    many times as needed. We at Guardcheck want to assist guards
                    in securing employment.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>
                What area does Guardcheck cover?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Guardcheck covers all regions belonging to South Africa, the
                    updated information is sent out to our proud growing
                    database of over 4000+ Guardcheck members.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>{" "}
                If a security guard is blacklisted can a company still hire the
                security guard?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Yes, we are just providing information so that the security
                    industry can make an informed decision when hiring their
                    employees.
                  </div>
                </div>
              </div>
            </li>
            <li
              class="accordion block wow fadeInUp"
              style="visibility: hidden; animation-name: none;">
              <div class="acc-btn">
                <div class="icon-outer">
                  <span class="icon icon-plus fa fa-angle-down"></span>
                </div>{" "}
                How do I contact the team?
              </div>
              <div class="acc-content">
                <div class="content">
                  <div class="text">
                    Please refer to the contact details on our website.
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default page;
