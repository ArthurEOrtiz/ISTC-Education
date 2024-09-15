using System.ComponentModel.DataAnnotations;

namespace istc_education_api.Validators
{
	public class TimeRangeAttribute : ValidationAttribute
	{
		private readonly string _comparisonProperty;

		public TimeRangeAttribute(string comparisonProperty)
		{
			_comparisonProperty = comparisonProperty;
		}

		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var currentValue = (TimeOnly)value;

			var property = validationContext.ObjectType.GetProperty(_comparisonProperty);

			if (property == null)
			{
				return new ValidationResult($"Unknown property: {_comparisonProperty}");
			}

			var comparisonValue = (TimeOnly)property.GetValue(validationContext.ObjectInstance);

			if (_comparisonProperty =="End" && currentValue > comparisonValue)
			{
				return new ValidationResult("Start time must be less than end time.");
			}

			if (_comparisonProperty == "Start" && currentValue < comparisonValue)
			{
				return new ValidationResult("End time must be greater than start time.");
			}

			return ValidationResult.Success;
		}
	}
}
