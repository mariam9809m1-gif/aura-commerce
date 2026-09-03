import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Package,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCommerce } from '../../context/CommerceContext';
import { CheckoutFormData, PaymentMethod, ShippingMethod } from '../../types/ecommerce';
import { validateCheckoutFormData } from '../../lib/validation';

export const CheckoutWizard: React.FC = () => {
  const { items, subtotal, discount, shippingCost: baseShipping, tax, total: cartTotal, clearCart, appliedPromo } = useCart();
  const { processCheckout, setActiveView } = useCommerce();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: 'Marcus Vance',
    email: 'marcus.vance@example.com',
    street: '742 Evergreen Terrace',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    country: 'United States',
    phone: '+1 (206) 555-0142',
    shippingMethod: 'standard',
    paymentMethod: 'credit_card',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '884',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculate adjusted shipping for chosen shipping method
  const shippingMultiplier = formData.shippingMethod === 'overnight' ? 45 : formData.shippingMethod === 'express' ? 25 : baseShipping;
  const calculatedTotal = Math.max(0, subtotal - discount + shippingMultiplier + tax);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Your bag is empty</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Please add items to your shopping bag prior to initiating the checkout wizard.
        </p>
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-neutral-800"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  const validateStep1 = () => {
    const res = validateCheckoutFormData(formData);
    setFormErrors(res.errors);
    return !res.errors.fullName && !res.errors.email && !res.errors.street && !res.errors.city && !res.errors.state && !res.errors.zip && !res.errors.phone;
  };

  const validateStep3 = () => {
    if (formData.paymentMethod === 'credit_card') {
      const cleanCard = (formData.cardNumber || '').replace(/\s+/g, '').replace(/•/g, '4');
      if (cleanCard.length < 13) {
        setFormErrors(prev => ({ ...prev, cardNumber: 'Please enter a valid card number' }));
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (validateStep3()) setStep(4);
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    // Prepare simulated pricing bundle
    const pricing = {
      subtotal,
      discount,
      shippingCost: shippingMultiplier,
      tax,
      total: calculatedTotal,
      promoCode: appliedPromo || undefined,
    };

    const response = await processCheckout(formData, items, pricing);

    setIsSubmitting(false);

    if ('error' in response) {
      setSubmissionError(response.error.message);
    } else {
      clearCart();
      // View switches to confirmation via processCheckout
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Progress Stepper */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    step > s.num
                      ? 'bg-neutral-900 text-white'
                      : step === s.num
                      ? 'bg-neutral-900 text-white ring-4 ring-neutral-200'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-[11px] font-semibold ${
                    step >= s.num ? 'text-neutral-900' : 'text-neutral-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>

              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step > idx + 1 ? 'bg-neutral-900' : 'bg-neutral-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Area (Steps 1 - 4) */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Shipping & Recipient Information
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Where should we dispatch your order? PII data is isolated and protected under strict security rules.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Full Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. Marcus Vance"
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="name@domain.com"
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="+1 (555) 000-0000"
                  />
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.phone}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={e => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    placeholder="1234 Luxury Ave, Suite 500"
                  />
                  {formErrors.street && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.street}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                  />
                  {formErrors.city && (
                    <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.city}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900"
                    />
                    {formErrors.state && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">ZIP *</label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={e => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono"
                    />
                    {formErrors.zip && (
                      <p className="text-[11px] text-red-600 mt-1 font-medium">{formErrors.zip}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Select Shipping Speed
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  All shipments are carbon-neutral and include end-to-end GPS telemetry tracking.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'standard' as ShippingMethod,
                    title: 'Standard Ground Delivery',
                    time: '3-5 Business Days',
                    cost: baseShipping === 0 ? 'FREE' : `$${baseShipping.toFixed(2)}`,
                    desc: 'Tracked ground transit with signed delivery receipt.',
                  },
                  {
                    id: 'express' as ShippingMethod,
                    title: 'Expedited Air Courier',
                    time: '2 Business Days',
                    cost: '$25.00',
                    desc: 'Priority air freight handling with direct morning dispatch.',
                  },
                  {
                    id: 'overnight' as ShippingMethod,
                    title: 'Overnight Priority Express',
                    time: 'Next Business Morning',
                    cost: '$45.00',
                    desc: 'Instant warehouse pull with dedicated courier handover.',
                  },
                ].map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setFormData({ ...formData, shippingMethod: opt.id })}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.shippingMethod === opt.id
                        ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={formData.shippingMethod === opt.id}
                        onChange={() => setFormData({ ...formData, shippingMethod: opt.id })}
                        className="mt-1 text-neutral-900 focus:ring-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900 block">{opt.title}</span>
                        <span className="text-[11px] text-neutral-500 block mt-0.5">{opt.desc}</span>
                        <span className="text-[11px] font-semibold text-neutral-800 mt-1 inline-block">
                          Estimated Transit: {opt.time}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-neutral-900">{opt.cost}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Secure Payment Gateway
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Transactions are encrypted and validated against mock payment authorization servers.
                </p>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'credit_card' as PaymentMethod, label: 'Credit Card', icon: CreditCard },
                  { id: 'apple_pay' as PaymentMethod, label: 'Apple Pay', icon: CheckCircle2 },
                  { id: 'paypal' as PaymentMethod, label: 'PayPal', icon: ShieldCheck },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: p.id })}
                    className={`py-3 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.paymentMethod === p.id
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <p.icon className="w-4 h-4" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'credit_card' ? (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">
                      Cardholder Number
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={e => setFormData({ ...formData, cardNumber: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono"
                        placeholder="4242 4242 4242 4242"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={formData.cardExp}
                        onChange={e => setFormData({ ...formData, cardExp: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono"
                        placeholder="12/28"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-700 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        value={formData.cardCvc}
                        onChange={e => setFormData({ ...formData, cardCvc: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 font-mono"
                        placeholder="884"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-xs font-bold text-neutral-900">
                    {formData.paymentMethod === 'apple_pay' ? 'Apple Pay Express Token' : 'PayPal One-Touch Protocol'}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Token authorization ready. No credit card manual numbers required.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-600">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict mock handler simulates 100% compliant PCI tokenization.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Review Order */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 font-display">
                  Final Order Review
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Confirm recipient details and items prior to stock decrement authorization.
                </p>
              </div>

              {/* Shipping info summary */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>Shipping Destination</span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-neutral-700">{formData.fullName} ({formData.phone})</p>
                <p className="text-neutral-500">{formData.street}, {formData.city}, {formData.state} {formData.zip}</p>
                <p className="text-neutral-500">{formData.email}</p>
                <p className="text-neutral-800 font-semibold pt-1">
                  Speed: <span className="capitalize">{formData.shippingMethod}</span>
                </p>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Line Items ({items.length})
                </p>
                {items.map(item => (
                  <div
                    key={`review-${item.product.id}`}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-neutral-100 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {submissionError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-200">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s => (s - 1) as any))}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('catalog')}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 cursor-pointer"
              >
                Cancel
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authorizing Stock & Payment...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Authorize & Place Order (${calculatedTotal.toFixed(2)})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
            <h4 className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
              Order Summary
            </h4>

            <div className="space-y-2 text-neutral-600 font-medium">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-neutral-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount ({appliedPromo})</span>
                  <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Postage & Handling</span>
                <span className="font-mono font-bold text-neutral-900">
                  {shippingMultiplier === 0 ? 'FREE' : `$${shippingMultiplier.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Sales Tax</span>
                <span className="font-mono font-bold text-neutral-900">
                  ${tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                <span>Grand Total</span>
                <span className="text-base font-display">
                  ${calculatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 text-[11px] text-neutral-500 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-neutral-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Trust Transaction</span>
              </div>
              <p>Inventory will decrement immediately upon authorization confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
