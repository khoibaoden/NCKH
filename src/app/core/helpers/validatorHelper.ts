
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
export const validationMessages = {
    firstName: [
        { type: 'required', message: 'Họ người dùng không được để trống' },
    ],
    lastName: [
        { type: 'required', message: 'Tên người dùng không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' }
    ],
    email: [
        { type: 'required', message: 'Email người dùng không được để trống' },
        { type: 'email', message: 'Email không hợp lệ ' }
    ],
    phoneNumber: [
        { type: 'required', message: 'Số điện thoại người dùng không được để trống' },
        { type: 'pattern', message: 'Số điện thoại không hợp lệ' }
    ],
    userName: [
        // { type: 'required', message: 'Tên đăng nhập người dùng không được để trống' },
        { type: 'pattern', message: 'Số điện thoại không hợp lệ' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'required', message: 'Email người dùng không được để trống' },
        { type: 'email', message: 'Email không hợp lệ ' }
    ],
    password: [
        { type: 'required', message: 'Mật khẩu không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt, một chữ hoa và một số' },

    ],
    newPassword: [
        { type: 'required', message: 'Mật khẩu mới không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt, một chữ hoa và một số' },

    ],
    oldPassword: [
        { type: 'required', message: 'Mật khẩu không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt, một chữ hoa và một số' },
    ],
    nameView: [
        { type: 'required', message: 'Tên hiển thị không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' }
    ],
    repeatPassword: [
        { type: 'required', message: 'Mật khẩu nhập lại không được để trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Mật khẩu phải chứa ít nhất 1 kí tự đặc biệt, một chữ hoa và một số' },

    ],
    otp: [
        { type: 'required', message: 'Otp không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' }
    ],
    trustMe: [
        { type: 'required', message: 'Đồng ý với điều khoản để tiếp tục' }
    ],
    //product
    tags: [
        { type: 'minLegthArray', message: 'Phải có ít nhất một tag' },

        /////
        { type: 'minLengthArray', message: 'Cần ít nhất 3 từ khóa.' },
        { type: 'maxLengthArray', message: 'Không thể thêm quá 6 từ khóa.' }

    ],
    name: [
        { type: 'required', message: 'Tên tài liệu không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'requiredNotOnlyWhitespace', message: 'Tên tài liệu không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    imageFileFormControl: [
        { type: 'required', message: 'Hình ảnh không được bỏ trống' },
    ],
    moreImageFile: [
        { type: 'required', message: 'Hình ảnh không được bỏ trống' },
        { type: 'minLegthArray', message: 'Phải có ít nhất một ảnh ' }
    ],
    typePrice: [
        { type: 'required', message: 'Loại giá không được bỏ trống' },
        { type: 'pattern', message: 'Loại giá chỉ thuộc 1 và 2' },
    ],
    typeCode: [
        { type: 'required', message: 'Vui lòng nhập Tên ngôn ngữ lập trình hoặc tên tệp tài liệu.' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'requiredNotOnlyWhitespace', message: 'Tên ngôn ngữ lập trình hoặc tên tệp tài liệu không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    price: [
        { type: 'required', message: 'Giá tài liệu không được bỏ trống' },
        { type: 'priceInvalid', message: 'Giá trị phải lớn hơn 0' },
        { type: 'requiredNotOnlyWhitespace', message: 'Giá tài liệu không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    guide: [
        { type: 'required', message: 'Hướng dẫn tài liệu không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' }
    ],
    commitment: [
        { type: 'required', message: 'Cam kết không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'requiredNotOnlyWhitespace', message: 'Cam kết không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    linkDownload: [
        { type: 'required', message: 'Link download không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Định dạng url không đúng' }

    ],
    linkYoutober: [
        { type: 'required', message: 'Link demo không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'pattern', message: 'Định dạng url không đúng' }

    ],
    subDescription: [
        { type: 'required', message: 'Mô tả ngắn không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'requiredNotOnlyWhitespace', message: 'Mô tả ngắn không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    description: [
        { type: 'required', message: 'Mô tả không được bỏ trống' },
        { type: 'maxlength', message: 'Quá nhiều kí tự' },
        { type: 'minlength', message: 'Quá ít kí tự' },
        { type: 'requiredNotOnlyWhitespace', message: 'Mô tả không được bỏ trống hoặc chỉ chứa khoảng trắng' }
    ],
    productCategoryId: [
        { type: 'required', message: 'Danh mục không được bỏ trống' },
    ],
};



export function requiredNotOnlyWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value ? control.value.trim() : '';
        return value.length === 0 ? { 'requiredNotOnlyWhitespace': true } : null;
    };
}


export function minLengthWithoutWhitespaceValidator(minLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value ? control.value.trim() : '';
        return value.length < minLength ? { 'minlength': { requiredLength: minLength, actualLength: value.length } } : null;
    };
}



export function notOnlyWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value ? control.value.trim() : '';
        return value.length === 0 ? { 'notOnlyWhitespace': true } : null;
    };
}



export function markAllAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        control?.markAsTouched({ onlySelf: true });
    });
}

// Custom Validator
export function minLegthArray(min: number): Validators {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value && control.value.length >= min ? null : { 'minLegthArray': { value: control.value } };
    };
}
export function minLengthArray(min: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value && control.value.length >= min ? null : { 'minLengthArray': { requiredLength: min, actualLength: control.value.length } };
    };
}

export function maxLengthArray(max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        return control.value && control.value.length <= max ? null : { 'maxLengthArray': { requiredLength: max, actualLength: control.value.length } };
    };
}

export function dateRangeValidator(): ValidatorFn {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const startDate = formGroup.get('startDate').value;
      const endDate = formGroup.get('endDate').value;
  
      // Không trả về lỗi nếu một trong hai trường chưa được nhập
      if (!startDate || !endDate) {
        return null;
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      // Trả về lỗi nếu endDate nhỏ hơn startDate
      return end >= start ? null : { 'dateRange': 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu' };
    };
  }