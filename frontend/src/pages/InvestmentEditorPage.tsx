import { ArrowLeft, Save } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, ApiClientError } from "../api/client";
import { LoadingState } from "../components/LoadingState";
import { AssetType, InvestmentInput } from "../types";

type FormValues = {
  assetType: AssetType;
  name: string;
  symbol: string;
  quantity: string;
  purchasePrice: string;
  currentPrice: string;
};

const assetTypes: AssetType[] = ["STOCK", "ETF", "BOND", "FUND", "CRYPTO", "CASH"];
const initialValues: FormValues = {
  assetType: "STOCK",
  name: "",
  symbol: "",
  quantity: "",
  purchasePrice: "",
  currentPrice: ""
};

export function InvestmentEditorPage() {
  const { investmentId } = useParams();
  const navigate = useNavigate();
  const parsedInvestmentId = investmentId ? Number(investmentId) : null;
  const editing = parsedInvestmentId !== null;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormValues, string>>>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadInvestment() {
      if (!parsedInvestmentId || !Number.isInteger(parsedInvestmentId)) {
        setRequestError("Investment id is invalid.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.getInvestment(parsedInvestmentId);
        if (active) {
          const investment = response.investment;
          setValues({
            assetType: investment.assetType,
            name: investment.name,
            symbol: investment.symbol ?? "",
            quantity: String(investment.quantity),
            purchasePrice: String(investment.purchasePrice),
            currentPrice: String(investment.currentPrice)
          });
        }
      } catch (error) {
        if (active) {
          setRequestError(
            error instanceof ApiClientError ? error.message : "Investment details could not be loaded."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (editing) {
      void loadInvestment();
    }

    return () => {
      active = false;
    };
  }, [editing, parsedInvestmentId]);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const field = event.target.name as keyof FormValues;
    const value = event.target.value;
    setValues((current) => ({
      ...current,
      [field]: field === "assetType" ? (value as AssetType) : value
    }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");
    const validation = validate(values);
    setErrors(validation.errors);

    if (!validation.input) {
      return;
    }

    setSaving(true);
    try {
      if (editing && parsedInvestmentId) {
        await api.updateInvestment(parsedInvestmentId, validation.input);
      } else {
        await api.createInvestment(validation.input);
      }
      navigate("/dashboard");
    } catch (error) {
      setRequestError(
        error instanceof ApiClientError ? error.message : "The investment could not be saved."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading investment" />;
  }

  return (
    <section className="editor-layout">
      <header className="page-header">
        <div>
          <Link className="back-link" to="/dashboard">
            <ArrowLeft aria-hidden="true" size={17} />
            Portfolio
          </Link>
          <h1>{editing ? "Edit Investment" : "Add Investment"}</h1>
        </div>
      </header>

      <form className="investment-form" onSubmit={handleSubmit}>
        {requestError ? <div className="alert">{requestError}</div> : null}
        <div className="form-grid">
          <label>
            Asset type
            <select name="assetType" onChange={updateField} value={values.assetType}>
              {assetTypes.map((assetType) => (
                <option key={assetType} value={assetType}>
                  {assetType}
                </option>
              ))}
            </select>
          </label>
          <label>
            Symbol
            <input
              maxLength={16}
              name="symbol"
              onChange={updateField}
              placeholder="Optional"
              value={values.symbol}
            />
          </label>
          <FormField
            error={errors.name}
            label="Investment name"
            name="name"
            onChange={updateField}
            required
            value={values.name}
          />
          <FormField
            error={errors.quantity}
            label="Quantity"
            min="0"
            name="quantity"
            onChange={updateField}
            required
            step="any"
            type="number"
            value={values.quantity}
          />
          <FormField
            error={errors.purchasePrice}
            label="Purchase price"
            min="0"
            name="purchasePrice"
            onChange={updateField}
            required
            step="0.01"
            type="number"
            value={values.purchasePrice}
          />
          <FormField
            error={errors.currentPrice}
            label="Current price"
            min="0"
            name="currentPrice"
            onChange={updateField}
            required
            step="0.01"
            type="number"
            value={values.currentPrice}
          />
        </div>
        <div className="form-actions">
          <Link className="button button-secondary" to="/dashboard">
            Cancel
          </Link>
          <button className="button button-accent" disabled={saving} type="submit">
            <Save aria-hidden="true" size={18} />
            {saving ? "Saving" : "Save investment"}
          </button>
        </div>
      </form>
    </section>
  );
}

type FormFieldProps = {
  error?: string;
  label: string;
  name: keyof FormValues;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  min?: string;
  required?: boolean;
  step?: string;
  type?: string;
};

function FormField({ error, label, name, ...inputProps }: FormFieldProps) {
  return (
    <label>
      {label}
      <input aria-invalid={Boolean(error)} name={name} {...inputProps} />
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  const quantity = Number(values.quantity);
  const purchasePrice = Number(values.purchasePrice);
  const currentPrice = Number(values.currentPrice);

  if (values.name.trim().length < 2) {
    errors.name = "Enter at least two characters.";
  }
  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = "Quantity must be greater than zero.";
  }
  if (!Number.isFinite(purchasePrice) || purchasePrice <= 0) {
    errors.purchasePrice = "Purchase price must be greater than zero.";
  }
  if (!Number.isFinite(currentPrice) || currentPrice < 0) {
    errors.currentPrice = "Current price cannot be negative.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const input: InvestmentInput = {
    assetType: values.assetType,
    name: values.name.trim(),
    symbol: values.symbol.trim(),
    quantity,
    purchasePrice,
    currentPrice
  };

  return { errors, input };
}

