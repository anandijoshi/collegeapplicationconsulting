/* ------------------------------------------------------------------
   SITE CONFIG — brand, contact, and your Stripe / Google Calendar links.
   (Services and prices live in data/services.js — edit those with admin.html.
    Testimonials live in data/testimonials.js.)
   See README.md for step-by-step setup.
------------------------------------------------------------------- */
window.SITE = {
  brand: "Anandi Joshi",
  email: "anandi.joshi@berkeley.edu",
  linkedinUrl: "www.linkedin.com/in/anandi-joshi", // e.g. "https://www.linkedin.com/in/your-handle" (button hides if empty)

  /* Google Calendar → "Appointment schedule" for your 30-minute consulting calls.
     bookingUrl = the embeddable form of the schedule (must end in ?gv=true).
     shareUrl   = your normal short link, used for the "open in a new tab" fallback. */
  calendar: {
    bookingUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1B1ooLxzfwquoh6JDEjvcSsB-46S6lOXW7qpA0J7LvfvNEJN5FAsS8tuD0EO5Uv_Dvu_l5uDPS?gv=true",
    shareUrl: "https://calendar.app.google/iQf9g3gona4nRkin8",
  },

  /* How the $50 consulting call gets paid. Pick ONE:

     A) Google Calendar collects the payment itself (needs a Google Workspace plan that
        supports appointment-schedule payments + a connected Stripe account).
        → set paymentInCalendar: true and leave paymentLink empty.

     B) Stripe Payment Link, then the calendar (works with any Google account).
        → set paymentLink to your $50 Stripe Payment Link, keep paymentInCalendar: false.
        In Stripe, set the link's redirect after payment to:
        https://YOURSITE.com/book.html?paid=call */
  consult: {
    paymentInCalendar: false,
    paymentLink: "https://buy.stripe.com/6oU8wOgrVf9B9tdbra5sA00",
  },
};
