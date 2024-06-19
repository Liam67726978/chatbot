//用戶登入和註冊的表單驗證通用代碼

class FieldValidator {
  /**
   * 構造器
   * @param {String} txtId 文本框元素id
   * @param {Function} validatorFn 驗證規格函數，當需要對該文本框進行驗證時，會調用該函數
   */
  constructor(txtId, validatorFn) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFn = validatorFn;
    this.input.addEventListener("blur", () => {
      this.validate();
    });
  }

  /**
   * 驗證，成功返回true，失敗返回false
   */
  // 提供外部方法給表單提交時驗證
  async validate() {
    const err = await this.validatorFn(this.input.value);
    if (err) {
      // 有錯誤
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }

  /**
   * 對傳入的所有驗證器進行驗證，如果所有驗證都通過，則返回true，否則返回false
   * @param  {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}
