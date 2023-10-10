import React from 'react';
import LandingLayout from '~/components/LandingLayout';
import { Header } from '~/components';

const IndexPage = () => {
  return (
    <LandingLayout
      customHeader={
        <Header>
          <meta
            name="description"
            content={`Please read these Terms and Conditions ("Terms") carefully before using the [https://www.lockspread.com] website and the LockSpread mobile application (together, or individually, the "Service") operated by LLSS Enterprises, Inc. d/b/a LockSpread ("LockSpread," "us", "we", or "our").`}
          />
        </Header>
      }
    >
      <div className="flex justify-center items-center p-2 h-full w-full text-justify">
        <div className={'flex flex-col gap-8 max-w-screen-xl p-4'}>
          <div className={'flex flex-col gap-4'}>
            <h1
              className={'text-2xl lg:text-3xl font-bold underline text-center'}
            >
              Terms and Conditions
            </h1>
            <p>Last updated: September 27, 2022</p>
            <p>
              Please read these Terms and Conditions (&quot;Terms&quot;)
              carefully before using the [https://www.lockspread.com] website
              and the LockSpread mobile application (together, or individually,
              the &quot;Service&quot;) operated by LLSS Enterprises, Inc. d/b/a
              LockSpread (&quot;LockSpread,&quot; &quot;us&quot;,
              &quot;we&quot;, or &quot;our&quot;).
            </p>
            <p>
              Your access to and use of the Service is conditioned upon your
              acceptance of and compliance with these Terms. These Terms apply
              to all visitors, users and others who wish to access or use the
              Service.
            </p>
            <p className={'font-semibold'}>
              BY REGISTERING AN ACCOUNT AND/OR OTHERWISE ACCESSING THE SERVICES
              OR BY CLICKING A BUTTON OR CHECKING A BOX INDICATING THAT YOU
              ACCEPT THESE TERMS, YOU ACCEPT AND AGREE TO BE BOUND AND COMPLY
              WITH THESE TERMS AND OUR PRIVACY POLICY (FOUND AT
              [https://www.lockspread.com/privacy-policy]), INCORPORATED HEREIN
              BY REFERENCE. IF YOU DO NOT AGREE TO THESE TERMS OR THE PRIVACY
              POLICY, YOU MUST NOT REGISTER AN ACCOUNT, OR ACCESS ANY OF THE
              SERVICES
            </p>
            <p className={'font-semibold'}>
              PLEASE READ THESE TERMS CAREFULLY, AS THEY CONTAIN AN AGREEMENT TO
              ARBITRATE AND OTHER IMPORTANT INFORMATION REGARDING YOUR LEGAL
              RIGHTS, REMEDIES, AND OBLIGATIONS.
            </p>
            <p>
              <span className={'font-semibold'}>Eligibility</span>
              <br />
              You must be at least eighteen (18) years of age to open an
              account, participate in the Services, and win prizes offered via
              the Services. In jurisdictions, territories, and locations where
              the minimum age for permissible use of the Website is greater than
              eighteen (18) years of age, you must meet the age requirement in
              your local jurisdiction or territory. You must be at least
              nineteen (19) years of age at time of account creation if you are
              a legal resident of Nebraska or Alabama or twenty-one (21) years
              of age if you are a legal resident of Arizona, Iowa, Louisiana, or
              Massachusetts. Legal residents physically located in any of the
              fifty (50) states and Washington, DC, excluding Connecticut,
              Hawaii, Idaho, Montana, Nevada, and Washington (the “Excluded
              States”) are eligible to open an account and participate in
              contests offered by the Website. Additional states may be included
              in or removed from the Excluded States section at our sole
              discretion. You agree to abide by all applicable laws in the
              jurisdiction where you are located while using the Service. We
              have the right, at any time, to request you to furnish us with
              proof of your identity, your age and/or your place of residence.
              Your account may be suspended pending receipt of this information
              to verify your eligibility to use the Services. If, as determined
              in our sole discretion, an account is deemed to be in breach of
              any term within this section, including rules regarding the age of
              majority and place of residence, any prizes won by use of that
              account will be forfeited.
            </p>
            <p>
              LockSpread employees (“Employees”) and any domestic partner or
              relative of an Employee who resides at an Employee’s residence,
              including but not limited to parents, grandparents, in-laws,
              children, siblings, and spouses (“Immediate Family Members”) are
              not permitted to play in any public contests or tournaments for
              prizes; provided, however, Employees and Immediate Family Members
              are permitted to play in the following contests: sponsored Private
              Contests, Private Contests for cash, or Private Contests for
              prizes other than cash. A “Private Contest” is one that is not
              listed on the Service’s public domain, and is hosted by another
              participating Employee, relative, friend of the Employee, or
              Immediate Family Member. Notwithstanding, Employees and Immediate
              Family Members living in the same household as such Employees
              located in Colorado are prevented from competing in any fantasy
              contests offered by any fantasy contest operator in which the
              operator offers a cash prize.
            </p>
            <p>
              Professional or amateur athletes, sports agents, coaches, team
              owners, team employees, referees or league officials, and their
              Immediate Family Members, are not eligible to participate in, and
              are strictly prohibited from entering, any contests or tournaments
              in the sport in which they are associated. Communications
            </p>
            <p>
              <span className={'font-semibold'}>Communications</span>
              <br />
              By creating an Account on our service, you agree to subscribe to
              newsletters, marketing or promotional materials and other
              information we may send. However, you may opt out of receiving
              any, or all, of these communications from us by following the
              unsubscribe link or instructions provided in any email we send.
            </p>
            <p>
              <span className={'font-semibold'}>Contests</span>
              <br />
              All contests offered by the Service are fantasy sports contests of
              skill. Winners are determined by the objective criteria described
              in the contest rules, scoring, and any other applicable
              documentation associated with the contest. From all entries
              received for each contest, the individuals who use their skill and
              knowledge of relevant sports information and fantasy sports rules
              to accumulate the most points according to the corresponding
              contest scoring rules will determine winners. Our Services
              (including, but not limited to, the contests) may not be used for
              any form of illicit gambling.
            </p>
            <p>
              Users will be able to visit the Service and view the contests and
              tournaments available for entry. Each contest or tournament that
              is not free to enter will have an entry fee listed in US dollars.
              When you elect to participate in a contest or tournament and
              complete the entry process, the listed amount of US dollars will
              be debited from your account.
            </p>
            <p>
              Entry fees and prizes may vary depending on the contest. See each
              contest’s rules for more information. Each contest is governed by
              its own set of rules. We encourage you to read the rules prior to
              entry. All taxes associated with the receipt of any prize are the
              sole responsibility of the winner. In the event that any legal
              authority challenges the awarding of any prizes to winners of a
              contest or tournament, LockSpread reserves the right in its sole
              discretion to determine whether or not to award such prizes.
            </p>
            <p>
              To the extent that LockSpread offers &apos;live&apos; scoring
              during gameplay, all &apos;live&apos; scoring and other
              information provided through the Service are unofficial. While
              LockSpread and the third parties used to provide the Services use
              reasonable efforts to include accurate and up-to-date information,
              neither LockSpread nor its third party providers warrant or make
              any representations of any kind with respect to the information
              provided through the Services and related information sources.
              LockSpread and its third party providers shall not be responsible
              or liable for the accuracy, usefulness, or availability of any
              information transmitted or made available via the Service and
              related information sources, and shall not be responsible or
              liable for any error or omissions in that information.
            </p>
            <p>
              Contest results will be based solely on the data provided by our
              third party data providers, which is subject to human error and
              may not be 100% accurate. As such, we cannot guarantee the
              accuracy of the data used to allocate points scoring in all
              circumstances, nor do we accept liability for any loss or damage
              resulting from any such inaccuracies. We reserve the right to make
              corrections or amendments to the scoring or points allocated
              during a contest at any time before the prize for that contest has
              been awarded. For more information regarding the scoring and
              points allocation system, please review the applicable rules for
              the contest.
            </p>
            <p>
              We reserve the right to suspend contest entries and/or cancel a
              contest at any time. Prizes will only be awarded if a contest is
              run to completion. In the event of a cancellation, all entry fees
              received for such contest will be credited back to each entrant’s
              account. We reserve the right to withhold payment and to cancel,
              suspend, and/or void any entries at our absolute discretion where:
              (i) there is a technological failure or other act beyond our
              reasonable control, including, but not limited to, an act of God,
              hurricane, war, fire, riot, earthquake, terrorism, an act of
              public enemies, actions of governmental authorities outside of our
              control, national emergency, pandemic, stoppage of athletic
              events, or other force majeure event; (ii) there is any issue with
              athlete tracking and/or projections; (iii) we suspect a breach any
              of these Terms; (iv) the integrity of the contest has been called
              into question; or (v) collusion between players has, or is
              believed to have, taken place.
            </p>
            <p>
              <span className={'font-semibold'}>Self-Exclusion</span>
              <br />
              You may voluntarily self-exclude yourself from accessing the
              Services at any time. You may ask for your account to be closed or
              restricted at any time by emailing us at [support@lockspread.com].
              By voluntarily self-excluding, you agree to provide full and
              accurate personal details, now and in the future, so as to allow
              access to, and/or use of, our Services to be restricted. If you
              choose to self-exclude, we will use all reasonable endeavors to
              ensure we comply with your self-exclusion. However in agreeing to
              self-exclude you accept that you have a parallel undertaking not
              to seek to circumvent voluntary self-exclusion. Accordingly, we
              have no responsibility or liability for any subsequent
              consequences or losses, howsoever caused, that you may suffer or
              incur if you commence or continue to access or make use of the
              Website through additional online accounts in circumstances where
              you have changed any of the registration details or you provide
              misleading, inaccurate or incomplete details or otherwise seek to
              circumvent the voluntary self-exclusion to which you agreed.
            </p>
            <p>
              During a period of self-exclusion, we will use reasonable efforts
              to not send you any marketing material and we will not accept any
              deposits or entries from you. During a period of self- exclusion,
              you may not open a new account. We will not reopen any
              self-excluded account; however, after the expiry of the exclusion
              period you may contact us and ask for your account to be reopened.
            </p>
            <p>
              For more information, please review our Responsible Gaming Policy,
              found at [lockspread.com/legal/Responsiblegaming.pdf].
            </p>
            <p>
              <span className={'font-semibold'}>Virtual Currency</span>
              <br />
              LockSpread may provide and/or allow you to obtain virtual currency
              (“Virtual Currency”) for use on the Website or Services,
              including, without limitation, contest or tournaments. You
              acknowledge that Virtual Currency has no real world value and
              cannot be redeemed (from us or any other party) for real money,
              goods or other items of monetary value.
            </p>
            <p>
              You acknowledge that you do not in fact “own” the Virtual
              Currency. By acquiring Virtual Currency, you acknowledge that you
              have obtained a limited and revocable license to a digital product
              for use only in the Website, including, without limitation, the
              contest or tournaments. This license is personal to the owner of
              the account participating in such contest or tournament, and
              Virtual Currency may not be sold, transferred, assigned, gifted,
              traded or sublicensed (including for monetary exchange or for any
              other value). Account holders may not combine, transfer or share
              Virtual Currency with other account holders.
            </p>
            <p>
              Any attempt to transfer, sell or perform any action related to
              your use of Virtual Currency in violation of these Terms of
              Service may subject you to termination of your account, a lifetime
              ban from using the Website or Services, and/or legal action. We
              reserve the right to take any other action or additional action we
              deem appropriate in our sole discretion in the event we believe
              (in our sole discretion) that you have violated these provisions
            </p>
            <p>
              <span className={'font-semibold'}>User Content </span>
              <br />
              Our Service allows you to post, link, store, share and otherwise
              make available certain information, text, graphics, videos, or
              other material (&quot;User Content&quot;). You are responsible for
              the User Content that you post on or through the Service,
              including its legality, reliability, and appropriateness.
            </p>
            <p>
              By posting User Content on or through the Service, you represent
              and warrant that: (i) the User Content is yours (you own it)
              and/or you have the right to use it and the right to grant us the
              rights and license as provided in these Terms, and (ii) that the
              posting of User Content on or through the Service does not violate
              the privacy rights, publicity rights, copyrights, contract rights
              or any other rights of any person or entity. We reserve the right
              to terminate the account of anyone found to be infringing on a
              copyright.
            </p>
            <p>
              You retain any and all of your rights to any User Content you
              submit, post or display on or through the Service and you are
              responsible for protecting those rights. We take no responsibility
              and assume no liability for User Content you or any third party
              posts on or through the Service. However, by posting User Content
              using the Service you grant us the right and license to use,
              modify, publicly perform, publicly display, reproduce, and
              distribute such User Content on and through the Service. You agree
              that this license includes the right for us to make your User
              Content available to other users of the Service, who may also use
              your User Content subject to these Terms.
            </p>
            <p>
              LockSpread has the right but not the obligation to monitor and
              edit all User Content provided by users.
            </p>
            <p>
              <span className={'font-semibold'}>Service Content</span>
              <br />
              You acknowledge and agree that the Service may contain content or
              features (“Service Content”) that are protected by copyright,
              patent, trademark, trade secret or other proprietary rights and
              laws. Except as expressly authorized by LockSpread, you agree not
              to modify, copy, frame, scrape, rent, lease, loan, sell,
              distribute or create derivative works based on the Service or the
              Service Content. If LockSpread blocks you from accessing the
              Service (including by blocking your IP address), you agree not to
              implement any measures to circumvent such blocking (e.g., by
              masking your IP address or using a proxy IP address). Any use of
              the Service or the Service Content other than as specifically
              authorized herein is strictly prohibited. The technology and
              software underlying the Service or distributed in connection
              therewith are the property of LockSpread, our affiliates and our
              partners (the “Software”). You agree not to copy, modify, create a
              derivative work of, reverse engineer, reverse assemble or
              otherwise attempt to discover any source code, sell, assign,
              sublicense, or otherwise transfer any right in the Software.
              LockSpread reserves any rights not expressly granted herein.
            </p>
            <p>
              The LockSpread name and logos are trademarks and service marks of
              LockSpread (collectively the “LockSpread Trademarks”). Other
              company, product, and service names and logos used and displayed
              via the Service may be trademarks or service marks of their
              respective owners who may or may not endorse or be affiliated with
              or connected to LockSpread. Nothing in these Terms or the Service
              should be construed as granting, by implication, estoppel, or
              otherwise, any license or right to use any of LockSpread
              Trademarks displayed on the Service, without our prior written
              permission in each instance. All goodwill generated from the use
              of LockSpread Trademarks will inure to our exclusive benefit.
            </p>
            <p>
              Unless otherwise expressly authorized herein or in the Service,
              you agree not to display, distribute, license, perform, publish,
              reproduce, duplicate, copy, create derivative works from, modify,
              sell, resell, exploit, transfer or upload for any commercial
              purposes, any portion of the Service, Service Content, use of the
              Service, or access to the Service. The Service is for your
              personal use only.
            </p>
            <p>
              <span className={'font-semibold'}>Accounts</span>
              <br />
              When you create an account with us, you guarantee that you are
              above the age of 18 (or age of majority required to participate in
              the Services in the jurisdiction in which you reside), and that
              the information you provide us is accurate, complete, and current
              at all times. Inaccurate, incomplete, or obsolete information may
              result in the immediate termination of your account on the
              Service.
            </p>
            <p>
              By signing up, you: (i) confirm that you have read these Terms and
              that you agree to be bound by them, our rules, and our Privacy
              Policy, each of which is incorporated by reference into these
              Terms, and (ii) represent that you are legally able to enter into
              a binding contract, agree to the use of electronic communication
              in order to enter into contracts, and that you waive any rights or
              requirements under applicable laws or regulations in any
              jurisdiction that requires an original (non-electronic) signature,
              to the extent permitted under applicable law. You agree to provide
              and maintain true, accurate, current and complete information
              about yourself as prompted by the Service’s registration form,
              including, but not limited to, your age, full name, place of
              residence and a valid email address. You represent and warrant
              that all registration and account information you supply to us is
              complete and accurate and (through timely updates) kept up to
              date. You are responsible for maintaining the accuracy of this
              information. Should the registration information provided prove
              false or misleading, we may suspend or terminate your account. Our
              Privacy Policy governs registration data and other information
              collected from us about you regarding your use of the Services.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password, including but not limited to the restriction
              of access to your computer and/or account. You agree to accept
              responsibility for any and all activities or actions that occur
              under your account and/or password, whether your password is with
              our Service or a third-party service. You must notify us
              immediately upon becoming aware of any breach of security or
              unauthorized use of your account.
            </p>
            <p>
              You may not use as a username the name of another person or entity
              or that is not lawfully available for use, a name or trademark
              that is subject to any rights of another person or entity other
              than you, without appropriate authorization. You may not use as a
              username any name that is offensive, vulgar or obscene.
            </p>
            <p>
              Your account is not a bank account and is therefore not insured,
              guaranteed, sponsored or otherwise protected by any deposit or
              banking insurance system or by any other similar insurance system.
              Deposits and prizes after contests are finished are held in a
              separate, segregated bank account. We use third-party electronic
              payment processors to process financial transactions executed
              through your use of the Services. You irrevocably authorize us to
              instruct such processors to handle deposits and withdrawals from
              your account and irrevocably agree that we may give such
              instructions on your behalf in accordance with your requests, or
              as consequence of your activity regarding use of the Services
            </p>
            <p>
              <span className={'font-semibold'}>Deposits and Withdrawals </span>
              <br />
              You may deposit funds in your account upon the providing of
              necessary information. The maximum deposit you can make into your
              account in any monthly period is USD $1,000.00; provided, we
              reserve the right to increase or decrease deposit limits pursuant
              to applicable law. If any deposit is charged back or is otherwise
              uncollectible for any reason, the amount of the initial deposit
              and any winnings generated from your participation in real money
              contests or tournaments from the time of the applicable deposit
              until its reversal or un-collectability shall be invalidated,
              forfeited and deducted from your account balance. LockSpread
              reserves the right to close your account if a deposit is charged
              back, or if it is determined that you: (i) are not of legal age in
              order to access the Services, or (ii) have violated any of the
              Terms at the time of making a deposit.
            </p>
            <p>
              In order for you to make any deposits by credit card, you must be
              the authorized user of such credit card. You agree to immediately
              notify us of any changes to your credit card account number, its
              expiration date and/or your billing address in order to make
              deposits with your credit card. If your credit card is cancelled
              or expired, you must immediately update your credit card prior to
              future use. We are not liable for any loss caused by any
              unauthorized use of your credit card or other method of payment by
              a third party in connection with the Services. Any attempt to
              defraud through the use of credit cards or other methods of
              payment, failure to honor legitimate charges or requests for
              payment, or any other violation of these Terms will result in
              immediate termination of your account, forfeiture of winnings, and
              pursuit of civil litigation and/or criminal prosecution.
            </p>
            <p>
              You may withdraw funds from your account at any time provided all
              prizes have been confirmed and you have satisfied our
              identification procedures. Where required by law, we will require
              you to furnish your tax identification number prior to payout of
              prizes. To make a withdrawal, you will need to fill out necessary
              information. Payments and withdrawals can be made using credit or
              debit cards registered to your address only. We may not accept
              certain cards for payments, deposits or withdrawals.
            </p>
            <p>
              In order to protect against fraud and collusion, and to comply
              with anti-money laundering requirements, you may be prevented from
              withdrawing funds until a period of at 48 hours has elapsed since
              your last deposit.
            </p>
            <p>
              You may be requested to complete an affidavit of eligibility and a
              liability/publicity release (unless prohibited by law) and/or
              appropriate tax forms and submit forms of identification including
              but not limited to a driver&apos;s license, proof of residence,
              and/or any information relating to payment/deposit accounts as
              reasonably requested by us in order to complete a withdrawal.
              Failure to comply with this requirement may result in
              disqualification and forfeiture of any prizes.
            </p>
            <p>
              <span className={'font-semibold'}>
                Third Party Payment Provider
              </span>
              <br />
              When you use a third-party payment service provider to make a
              deposit on our website, the third-party payment service provider
              maintains primary responsibility for payment and payment related
              customer support. The terms between the third-party payment
              service provider and customers who utilize services of the third
              party are governed by a separate agreement between the service
              provider and the customer, and are not subject to these Terms. It
              is your responsibility to review any agreements you may with such
              third-party payment service provider, and you agree LockSpread
              shall not be liable for any damages resulting from your use of
              such third-party payment service provider.
            </p>
            <p>
              <span className={'font-semibold'}>Refund Policy</span>
              <br />
              All payments (including, but not limited to, entry fees) provided
              for use of the Services are final. Except as otherwise provided in
              these Terms, no refunds will be issued. In the event of a dispute
              regarding the identity of the person submitting an entry, the
              entry will be deemed submitted by the person in whose name the
              account was registered.
            </p>
            <p>
              <span className={'font-semibold'}>
                Conditions of Participation
              </span>
              <br />
              LockSpread reserves the right to investigate and take appropriate
              legal action against anyone who, in LockSpread’s sole discretion,
              violates these Terms, including without limitation, removing the
              offending user from the Service, suspending or terminating the
              account of such violators and/or reporting you to law enforcement
              authorities. You agree not to engage in any of the following
              activities regarding your use of the Services:
              <ul className="list-disc pl-10 space-y-4 pt-4">
                <li>
                  Submit false, misleading, or inaccurate personal information
                  to create an account, enter a contest or tournament, or claim
                  a prize;
                </li>
                <li>
                  Engage in any type of collusion, syndicate play, or financial
                  fraud, including, but not limited to, unauthorized use of
                  credit instruments to create an account, enter a contest or
                  tournament, or claim a prize;
                </li>
                <li>
                  Use automated means (including but not limited to scripts and
                  third-party tools) to interact with the Service in any way
                  (this includes, but is not limited to: creating a contest or
                  tournament, entering a contest or tournament, withdrawing from
                  a contest or tournament, and/or otherwise participating in the
                  contest or tournament);
                </li>
                <li>
                  Tamper with the administration of a contest or tournament;
                </li>
                <li>
                  Disable, remove, circumvent, damage, or otherwise interfere
                  with any features (security related or otherwise) implemented
                  by the Service;
                </li>
                <li> Abuse the Website or Services;</li>
                <li>
                  Use or access the Services from any jurisdiction or territory
                  in which use of the Services is illegal or impermissible;
                </li>
                <li>
                  Violate any applicable local, state, national or international
                  law, or any regulations having the force of law;
                </li>
                <li>
                  Impersonate any person or entity, or falsely state or
                  otherwise misrepresent your affiliation with a person or
                  entity;
                </li>
                <li>
                  Further or promote any criminal activity or enterprise or
                  provide instructional information about illegal activities; or
                </li>
                <li>
                  Obtain or attempt to access or otherwise obtain any materials
                  or information through any means not intentionally made
                  available or provided for through the Service.
                </li>
              </ul>
            </p>
            <p>
              By entering into a contest or tournament or accepting any prize,
              to the extent allowable by law, you grant LockSpread and our
              affiliates, suppliers, and licensors and licensees a perpetual,
              worldwide, royalty-free irrevocable, non-exclusive right and
              license to use your name, voice, likeness, and digital and/or
              electronic image or likeness and any biographical information
              about you, and to reproduce, modify, adapt, publish, publicly and
              digitally display, translate, create derivative works from, and/or
              distribute such materials or incorporate such materials into any
              form, medium, or technology, now known or later developed,
              throughout the world, and the right to copy, disclose, distribute,
              incorporate and otherwise use such material for any and all
              commercial or non-commercial purposes. LockSpread may, in its sole
              and absolute discretion, require you to execute a separate release
              of claims as a condition of being awarded any prize or receiving
              any payout.
            </p>
            <p>
              LockSpread is not responsible for any incorrect, invalid or
              inaccurate information provided by users for use of the Services;
              human errors; technical malfunctions; failures, including public
              utility or telephone outages; omissions, interruptions, deletions
              or defects of any network, computer online systems, data, computer
              equipment, servers, providers, or software (including, but not
              limited to software and operating systems that do not permit you
              to participate in a contest or tournament), including, without
              limitation, any injury or damage to you and/or your personal
              property relating to or resulting from accessing the Services or
              participation in a contest or tournament; inability to access the
              Service, or any web pages that are part of or related to the
              Service; theft, tampering, destruction, or unauthorized access to
              accounts; data that is processed late, incorrectly, or is
              incomplete or lost due to computer or electronic malfunction, or
              the Internet, or any service provider`&apos;s facilities, or any
              website or for any other reason whatsoever; typographical,
              printing or other errors, or any combination thereof.
            </p>
            <p>
              Participation in each contest or tournament must be made only as
              specified in these Terms and applicable contest rules. Failure to
              comply with these Terms or applicable contest rules will result in
              disqualification and, if applicable, prize forfeiture.
            </p>
            <p>
              All contest or tournament entries shall become the property of
              LockSpread. LockSpread reserves the right to move entrants from a
              contest or tournament they have entered to a substantially similar
              contest or tournament in certain situations as determined by
              LockSpread in its sole discretion
            </p>
            <p>
              <span className={'font-semibold'}>Links To Other Web Sites</span>
              <br />
              Our Service may contain links to third party web sites or services
              that are not owned or controlled by LockSpread. LockSpread has no
              control over, and assumes no responsibility for the content,
              privacy policies, or practices of any third party web sites or
              services. We do not warrant the offerings of any of these
              entities/individuals or their websites.
            </p>
            <p>
              You acknowledge and agree that LockSpread shall not be responsible
              or liable, directly or indirectly, for any damage or loss caused
              or alleged to be caused by or in connection with use of or
              reliance on any such content, goods or services available on or
              through any such third party web sites or services. We strongly
              advise you to read the terms and conditions and privacy policies
              of any third party web sites or services that you visit.
            </p>
            <p>
              <span className={'font-semibold'}>Third Party Material</span>
              <br />
              Under no circumstances will LockSpread be liable in any way for
              any content or materials of any third parties (including User
              Content), including, but not limited to, for any errors or
              omissions in any content, or for any loss or damage of any kind
              incurred as a result of the use of any such content. You
              acknowledge that LockSpread does not pre-screen content, but that
              LockSpread and its designees will have the right (but not the
              obligation) in their sole discretion to refuse or remove any
              content that is available via the Service. Without limiting the
              foregoing, LockSpread and its designees will have the right to
              remove any content that violates these Terms or is deemed by
              LockSpread, in its sole discretion, to be otherwise objectionable.
              You agree that you must evaluate, and bear all risks associated
              with, the use of any content, including any reliance on the
              accuracy, completeness, or usefulness of such content.
            </p>
            <p>
              <span className={'font-semibold'}>Termination</span>
              <br />
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to lack of use or if LockSpread believes
              that you have violated these Terms. Any suspected fraudulent,
              abusive or illegal activity that may be grounds for termination of
              your use of Service may be referred to appropriate law enforcement
              authorities. LockSpread may also in its sole discretion and at any
              time discontinue providing the Service, or any part thereof, with
              or without notice. You agree that any termination of your access
              to the Service under any provision of this Terms may be affected
              without prior notice, and acknowledge and agree that LockSpread
              may immediately deactivate or delete your account and all related
              information and files in your account and/or bar any further
              access to such files or the Service. Further, you agree that
              LockSpread will not be liable to you or any third party for any
              termination of your access to the Service.
            </p>
            <p>
              If you wish to terminate your account, you may simply discontinue
              using the Service.
            </p>
            <p>
              All provisions of the Terms which by their nature should survive
              termination shall survive termination, including, without
              limitation, ownership provisions, warranty disclaimers, indemnity
              and limitations of liability.
            </p>
            <p>
              <span className={'font-semibold'}>Indemnification </span>
              <br />
              You agree to release, defend, indemnify and hold harmless
              LockSpread and its licensee and licensors, and their employees,
              contractors, agents, officers and directors, from and against any
              and all claims, damages, obligations, losses, liabilities, costs
              or debt, and expenses (including but not limited to
              attorney&apos;s fees), resulting from or arising out of a) your
              use and access of the Service, by you or any person using your
              account and password; b) a breach of these Terms, or c) User
              Content posted on the Service. If you are a California resident,
              you waive California Civil Code Section 1542, which says: “A
              general release does not extend to claims which the creditor does
              not know or suspect to exist in his favor at the time of executing
              the release, which if known by him must have materially affected
              his settlement with the debtor.” If you are a resident of another
              jurisdiction, you waive any comparable statute or doctrine
            </p>
            <p>
              <span className={'font-semibold'}>Limitation Of Liability </span>
              <br />
              In no event shall LockSpread, nor its directors, employees,
              partners, agents, suppliers, or affiliates, be liable for any
              indirect, incidental, special, consequential or punitive damages,
              including without limitation, loss of profits, data, use,
              goodwill, or other intangible losses, resulting from (i) your
              access to or use of or inability to access or use the Service;
              (ii) any conduct or content of any third party on the Service;
              (iii) any content obtained from the Service; and (iv) unauthorized
              access, use or alteration of your transmissions or content,
              whether based on warranty, contract, tort (including negligence)
              or any other legal theory, whether or not we have been informed of
              the possibility of such damage, and even if a remedy set forth
              herein is found to have failed of its essential purpose.
            </p>
            <p>
              <span className={'font-semibold'}>Disclaimer </span>
              <br />
              Your use of the Service is at your sole risk. The Service is
              provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot;
              basis. The Service is provided without warranties of any kind,
              whether express or implied, including, but not limited to, implied
              warranties of merchantability, fitness for a particular purpose,
              non-infringement or course of performance.
            </p>
            <p>
              LockSpread, its subsidiaries, affiliates, and its licensors do not
              warrant that a) the Service will function uninterrupted, secure or
              available at any particular time or location; b) any errors or
              defects will be corrected; c) the Service is free of viruses or
              other harmful components; or d) the results of using the Service
              will meet your requirements.
            </p>
            <p>
              <span className={'font-semibold'}>Exclusions </span>
              <br />
              Some jurisdictions do not allow the exclusion of certain
              warranties or the exclusion or limitation of liability for
              consequential or incidental damages, so the limitations above may
              not apply to you.
            </p>
            <p>
              <span className={'font-semibold'}>Arbitration Agreement </span>
              <br />
              You agree that any and all disputes or claims that have arisen or
              may arise between you and LockSpread, whether arising out of or
              relating to these Terms (including any alleged breach thereof),
              the Services, any advertising, any aspect of the relationship or
              transactions between us, shall be resolved exclusively through
              final and binding arbitration in accordance with the terms of this
              Arbitration Agreement. You agree that, by entering into these
              Terms, you and LockSpread are each waiving the right to a trial by
              jury or to participate in a class action. Your rights will be
              determined by a neutral arbitrator, not a judge or jury. The
              Federal Arbitration Act governs the interpretation and enforcement
              of this Arbitration Agreement.
            </p>
            <p>
              YOU AND LOCKSPREAD AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST
              THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR
              CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR
              PROCEEDING. UNLESS BOTH YOU AND LOCKSPREAD AGREE OTHERWISE, THE
              ARBITRATOR MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON’S OR
              PARTY’S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A
              CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING. ALSO, THE
              ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
              DECLARATORY RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL PARTY SEEKING
              RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE RELIEF
              NECESSITATED BY THAT PARTY’S INDIVIDUAL CLAIM(S), EXCEPT THAT YOU
              MAY PURSUE A CLAIM FOR AND THE ARBITRATOR MAY AWARD INJUNCTIVE
              RELIEF UNDER APPLICABLE LAW TO THE EXTENT REQUIRED FOR THE
              ENFORCEABILITY OF THIS PROVISION.
            </p>
            <p>
              A party who intends to seek arbitration must first send to the
              other, by certified mail or email, a written Notice of Dispute
              (“Notice”). The Notice to LockSpread should be sent to
              [support@lockspread.com]. You agree that all notices to be sent to
              you shall be sent to the email associated with your account. The
              Notice must (i) describe the nature and basis of the claim or
              dispute and (ii) set forth the specific relief sought. If
              LockSpread and you do not resolve the claim within sixty (60)
              calendar days after the Notice is received, you or LockSpread may
              commence an arbitration proceeding.
            </p>
            <p>
              Arbitration will be conducted by a neutral arbitrator in
              accordance with the American Arbitration Association’s (“AAA”)
              rules and procedures, including the AAA’s Consumer Arbitration
              Rules (collectively, the “AAA Rules”), as modified by this
              Arbitration Agreement. For information on the AAA, please visit
              its website, http://www.adr.org. Information about the AAA Rules
              and fees for consumer disputes can be found at the AAA’s consumer
              arbitration page, http://www.adr.org/consumer_arbitration. If
              there is any inconsistency between any term of the AAA Rules and
              any term of this Arbitration Agreement, the applicable terms of
              this Arbitration Agreement will control. All issues are for the
              arbitrator to decide, including, but not limited to, issues
              relating to the scope, enforceability, and arbitrability of this
              Arbitration Agreement. The arbitrator may award any relief that a
              court of competent jurisdiction could award, and the arbitration
              decision may be enforced in any court of competent jurisdiction.
              You agree to abide by all decisions and awards rendered in such a
              proceeding, which shall be final and conclusive. At your request,
              hearings may be conducted in person or by telephone. The
              prevailing party in any action or proceeding shall be entitled to
              reasonable costs and attorneys&apos; fees.
            </p>
            <p>
              Unless LockSpread and you agree otherwise, any arbitration
              hearings will take place in a reasonably convenient location for
              both parties with due consideration of their ability to travel and
              other pertinent circumstances. If the parties are unable to agree
              on a location, AAA shall make the determination. If your claim is
              for $10,000 or less, LockSpread agrees that you may choose whether
              the arbitration will be conducted solely on the basis of documents
              submitted to the arbitrator, through a telephonic hearing, or by
              an in-person hearing as established by the AAA Rules. If your
              claim exceeds $10,000, the AAA Rules will determine the right to a
              hearing. Regardless of the manner in which the arbitration is
              conducted, the arbitrator shall issue a reasoned written decision
              sufficient to explain the essential findings and conclusions on
              which the award is based.
            </p>
            <p>
              Notwithstanding the foregoing arbitration provisions, in no event
              shall LockSpread be precluded or delayed from seeking and
              obtaining temporary, preliminary and/or permanent injunctive
              relief, without the posting of any bond or proving of actual
              damages, against infringement or other violation of its claimed
              intellectual property rights in a court of appropriate
              jurisdiction. All aspects of the arbitration proceeding, and any
              ruling, decision, or award by the arbitrator, will be strictly
              confidential for the benefit of all parties.
            </p>
            <p>
              If a court or the arbitrator decides that any term or provision of
              this Arbitration Agreement (other than prohibition of class and
              representative actions and non-individualized relief as set forth
              herein) is invalid or unenforceable, the parties agree to replace
              such term or provision with a term or provision that is valid and
              enforceable and that comes closest to expressing the intention of
              the invalid or unenforceable term or provision, and this
              Arbitration Agreement shall be enforceable as so modified. If a
              court or the arbitrator decides that any of the provisions
              regarding the prohibition of class and representative actions and
              non-individualized relief as set forth herein are invalid or
              unenforceable, then the entirety of this Arbitration Agreement
              shall be null and void, unless such provisions are deemed to be
              invalid or unenforceable solely with respect to claims for
              injunctive relief. The remainder of the Terms will continue to
              apply.
            </p>
            <p>
              <span className={'font-semibold'}>Privacy Policy </span>
              <br />
              We respect the privacy of our users. For details please see our
              Privacy Policy. By using the Service, you consent to our
              collection and use of personal data as outlined therein.
            </p>
            <p>
              <span className={'font-semibold'}>Governing Law</span>
              <br />
              These Terms shall be governed and construed in accordance with the
              laws of New Jersey, United States, without regard to its conflict
              of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will
              not be considered a waiver of those rights. If any provision of
              these Terms is held to be invalid or unenforceable by a court, the
              remaining provisions of these Terms will remain in effect. These
              Terms constitute the entire agreement between us regarding our
              Service, and supersede and replace any prior agreements we might
              have had between us regarding the Service.
            </p>
            <p>
              <span className={'font-semibold'}>Changes</span>
              <br />
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material we will provide
              at least 60 days notice prior to any new terms taking effect. What
              constitutes a material change will be determined at our sole
              discretion. By continuing to access or use our Service after any
              revisions become effective, you agree to be bound by the revised
              terms. If you do not agree to the new terms, you are no longer
              authorized to use the Service.
            </p>
            <p>
              <span className={'font-semibold'}>Contact Us</span>
              <br />
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
};

export default IndexPage;
