document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 커스텀 셀렉트 박스 초기화
    // ========================================

    initCustomSelects();

    function initCustomSelects() {
        const selects = document.querySelectorAll('.select-type2');

        selects.forEach(select => {
            // 기존 select 숨기기
            select.style.display = 'none';

            // 커스텀 셀렉트 컨테이너 생성
            const customSelect = document.createElement('div');
            customSelect.className = 'custom-select';

            // 트리거 (현재 선택된 값 표시)
            const trigger = document.createElement('div');
            trigger.className = 'custom-select-trigger';
            trigger.textContent = select.options[select.selectedIndex]?.text || '';

            // 값이 비어있으면 placeholder 클래스 추가
            if (select.value === '') {
                trigger.classList.add('placeholder');
            }

            // 옵션 리스트
            const optionsList = document.createElement('div');
            optionsList.className = 'custom-select-options';

            // 옵션들 생성
            Array.from(select.options).forEach((option, index) => {
                const customOption = document.createElement('div');
                customOption.className = 'custom-select-option';
                if (index === select.selectedIndex) {
                    customOption.classList.add('selected');
                }
                customOption.textContent = option.text;
                customOption.dataset.value = option.value;

                customOption.addEventListener('click', function(e) {
                    e.stopPropagation();

                    // 기존 선택 해제
                    optionsList.querySelectorAll('.custom-select-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });

                    // 새 선택
                    this.classList.add('selected');
                    trigger.textContent = this.textContent;

                    // 원본 select 값 변경
                    select.value = this.dataset.value;
                    select.dispatchEvent(new Event('change', { bubbles: true }));

                    // placeholder 클래스 토글
                    if (this.dataset.value === '') {
                        trigger.classList.add('placeholder');
                    } else {
                        trigger.classList.remove('placeholder');
                    }

                    // 드롭다운 닫기
                    customSelect.classList.remove('open');
                });

                optionsList.appendChild(customOption);
            });

            // 트리거 클릭 시 드롭다운 토글
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();

                // 다른 열린 드롭다운 닫기
                document.querySelectorAll('.custom-select.open').forEach(openSelect => {
                    if (openSelect !== customSelect) {
                        openSelect.classList.remove('open');
                    }
                });

                customSelect.classList.toggle('open');
            });

            customSelect.appendChild(trigger);
            customSelect.appendChild(optionsList);

            // 원본 select 뒤에 삽입
            select.parentNode.insertBefore(customSelect, select.nextSibling);
        });

        // 문서 클릭 시 모든 드롭다운 닫기
        document.addEventListener('click', function() {
            document.querySelectorAll('.custom-select.open').forEach(openSelect => {
                openSelect.classList.remove('open');
            });
        });
    }

    // 커스텀 셀렉트 업데이트 함수 (외부에서 select 값 변경 시 호출)
    window.updateCustomSelect = function(selectElement) {
        const customSelect = selectElement.nextElementSibling;
        if (customSelect && customSelect.classList.contains('custom-select')) {
            const trigger = customSelect.querySelector('.custom-select-trigger');
            const options = customSelect.querySelectorAll('.custom-select-option');

            trigger.textContent = selectElement.options[selectElement.selectedIndex]?.text || '';

            options.forEach(opt => {
                opt.classList.remove('selected');
                if (opt.dataset.value === selectElement.value) {
                    opt.classList.add('selected');
                }
            });
        }
    };

    // ========================================
    // 요소 참조
    // ========================================

    // 통신망 및 결제방식
    const carrierSelect = document.getElementById('carrier');
    const paymentTypeSelect = document.getElementById('paymentType');

    // 방문 고객 정보
    const relationshipSelect = document.getElementById('relationship');
    const customerTypeSelect = document.getElementById('customerType');
    const businessTypeSelect = document.getElementById('businessType');
    const applicantNameGroup = document.getElementById('applicantNameGroup');
    const agentNameGroup = document.getElementById('agentNameGroup');

    // 가입 고객 정보
    const customerNameInput = document.getElementById('customerName');
    const birthDateInput = document.getElementById('birthDate');

    // 요금납부정보
    const autoRechargeMethodSelect = document.getElementById('autoRechargeMethod');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const accountNumberInput = document.getElementById('accountNumber');
    const sameAsSubscriberCheckbox = document.getElementById('sameAsSubscriber');
    const accountHolderInput = document.getElementById('accountHolder');
    const accountHolderBirthInput = document.getElementById('accountHolderBirth');
    const accountHolderRelationInput = document.getElementById('accountHolderRelation');
    const bankNameFieldGroup = document.getElementById('bankName')?.closest('.field-group');

    // 가입정보
    const isEsimCheckbox = document.getElementById('isEsim');
    const usimNumberInput = document.getElementById('usimNumber');
    const otherServiceCheckbox = document.getElementById('otherService');
    const otherServiceNameInput = document.getElementById('otherServiceName');

    // 단말기 정보
    const deviceModelInput = document.getElementById('deviceModel');
    const deviceFieldGroup = deviceModelInput?.closest('.field-group');

    // SIM 정보
    const simFieldGroup = usimNumberInput?.closest('.field-group');

    // ========================================
    // 유틸리티 함수
    // ========================================

    /*     * 요소 표시/숨김     */
    function toggleVisibility(element, show) {
        if (element) {
            element.classList.toggle('hidden', !show);
        }
    }

    /*     * 입력 필드 활성화/비활성화     */
    function toggleDisabled(element, disabled) {
        if (element) {
            element.disabled = disabled;
            if (disabled) {
                element.value = '';
            }
        }
    }

    // ========================================
    // 1. 통신망 선택 (SKT / KT / LGU)
    // ========================================

    const lguSimRow = document.getElementById('lguSimRow');
    const defaultSimInput = document.getElementById('defaultSimInput');

    carrierSelect?.addEventListener('change', function() {
        const carrier = this.value;

        // LGU+ 선택 시 SIM 정보 레이아웃 변경
        if (carrier === 'LGU') {
            lguSimRow.style.display = 'flex';
            defaultSimInput.style.display = 'none';
        } else {
            lguSimRow.style.display = 'none';
            defaultSimInput.style.display = 'block';
        }

        console.log('통신망 변경:', carrier);

        // 요금제 선택 초기화 (통신망 변경 시)
        const planSelect = document.getElementById('plan');
        if (planSelect) {
            planSelect.innerHTML = '<option value="">요금제를 선택해주세요.</option>';
        }
    });

    // ========================================
    // 2. 결제방식 선택 (후불 / 선불)
    // ========================================

    function togglePaymentType(paymentType) {
        const prepaidElements = document.querySelectorAll('.prepaid-only');
        const postpaidElements = document.querySelectorAll('.postpaid-only');
        const numberTransferSection = document.getElementById('numberTransferSection');
        const paymentInfoSection = document.getElementById('paymentInfoSection');
        const subscriptionInfoSection = document.getElementById('subscriptionInfoSection');
        const agentInfoSection = document.getElementById('agentInfoSection');
        const formContainer = document.getElementById('applicationForm');
        const wishNumberSection = document.getElementById('wishNumberSection');
        const simInfoGroup = document.querySelector('.field-group:has(#isEsim)');
        const prepaidNumberTransferGroup = document.querySelector('.prepaid-number-transfer');
        const businessType = businessTypeSelect?.value;

        if (paymentType === 'prepaid') {
            // 선불: prepaid-only 표시, postpaid-only 숨김
            prepaidElements.forEach(el => {
                el.style.display = '';
            });
            postpaidElements.forEach(el => {
                el.style.display = 'none';
            });
            // 번호 이동 정보 섹션도 숨김 (선불은 후불용 번호이동 섹션 숨김)
            if (numberTransferSection) {
                numberTransferSection.style.display = 'none';
            }
            // 선불 + 번호이동일 경우 선불용 번호이동 필드 표시
            if (prepaidNumberTransferGroup && businessType === 'numberTransfer') {
                prepaidNumberTransferGroup.style.display = 'block';
            }
            // 선불: 가입정보 섹션을 요금납부정보 섹션 앞으로 이동
            if (subscriptionInfoSection && paymentInfoSection && formContainer) {
                formContainer.insertBefore(subscriptionInfoSection, paymentInfoSection);
            }
            // 선불: 뒷자리 희망번호를 SIM 정보 다음으로 이동
            if (wishNumberSection && simInfoGroup) {
                simInfoGroup.parentNode.insertBefore(wishNumberSection, simInfoGroup.nextSibling);
            }
            // 선불 전환 시 가입자와의 관계 확인하여 신청 고객 (대리인) 필드 표시/숨김
            const relationship = relationshipSelect?.value;
            if (applicantNameGroup) {
                if (relationship !== 'self') {
                    applicantNameGroup.style.display = 'block';
                } else {
                    applicantNameGroup.style.display = 'none';
                }
            }
        } else {
            // 후불: postpaid-only 표시, prepaid-only 숨김
            prepaidElements.forEach(el => {
                el.style.display = 'none';
            });
            postpaidElements.forEach(el => {
                el.style.display = '';
            });
            // 선불용 번호이동 필드 숨김
            if (prepaidNumberTransferGroup) {
                prepaidNumberTransferGroup.style.display = 'none';
            }
            // 번호 이동 정보 섹션은 업무구분에 따라 결정
            if (numberTransferSection && businessType === 'numberTransfer') {
                numberTransferSection.style.display = 'block';
            }
            // 후불: 가입정보 섹션을 접수자 정보 바로 위로 이동
            if (subscriptionInfoSection && agentInfoSection && formContainer) {
                formContainer.insertBefore(subscriptionInfoSection, agentInfoSection);
            }
            // 후불: 뒷자리 희망번호를 원래 위치로 (요금제 다음)
            const planGroup = document.querySelector('.field-group:has(#plan)');
            if (wishNumberSection && planGroup) {
                planGroup.parentNode.insertBefore(wishNumberSection, planGroup.nextSibling);
            }
            // 후불 전환 시 신청 고객 (대리인) 필드 숨김 (선불 전용)
            if (applicantNameGroup) {
                applicantNameGroup.style.display = 'none';
            }
            // 후불 전환 시 가입자와의 관계 확인하여 신청 고객명 (대리인) 필드 표시/숨김
            const relationship = relationshipSelect?.value;
            if (agentNameGroup) {
                if (relationship !== 'self') {
                    agentNameGroup.style.display = 'block';
                } else {
                    agentNameGroup.style.display = 'none';
                }
            }
        }

        console.log('결제방식 변경:', paymentType);
    }

    paymentTypeSelect?.addEventListener('change', function() {
        togglePaymentType(this.value);
    });

    // ========================================
    // 2-1. 자동 충전 방법 선택 (선불 전용)
    // ========================================

    autoRechargeMethodSelect?.addEventListener('change', function() {
        const rechargeMethod = this.value;
        const paymentType = paymentTypeSelect?.value;

        // 선불일 때만 동작
        if (paymentType === 'prepaid') {
            const paymentMethodGroup = paymentMethodSelect?.closest('.field-group');
            const autoRechargeAmountGroup = document.getElementById('autoRechargeAmountGroup');
            const accountHolderGroup = document.getElementById('accountHolderGroup');
            const bankNameGroup = document.getElementById('bankNameGroup');
            const accountNumberGroup = document.getElementById('accountNumberGroup');
            const prepaidCardInfoGroup = document.getElementById('prepaidCardInfoGroup');
            const paymentContactPhoneGroup = document.getElementById('paymentContactPhoneGroup');

            if (rechargeMethod === 'bank') {
                // 은행 선택: 자동충전 금액 + 예금주 + 은행명 + 계좌번호 표시
                if (autoRechargeAmountGroup) autoRechargeAmountGroup.style.display = 'block';
                if (paymentMethodGroup) paymentMethodGroup.style.display = 'none';
                if (accountHolderGroup) accountHolderGroup.style.display = 'block';
                if (bankNameGroup) bankNameGroup.style.display = 'block';
                if (accountNumberGroup) accountNumberGroup.style.display = 'block';
                if (prepaidCardInfoGroup) prepaidCardInfoGroup.style.display = 'none';
                if (paymentContactPhoneGroup) paymentContactPhoneGroup.style.display = 'none';
            } else if (rechargeMethod === 'card') {
                // 신용카드 선택: 자동충전 금액 + 예금주 + 카드 정보 표시
                if (autoRechargeAmountGroup) autoRechargeAmountGroup.style.display = 'block';
                if (paymentMethodGroup) paymentMethodGroup.style.display = 'none';
                if (accountHolderGroup) accountHolderGroup.style.display = 'block';
                if (bankNameGroup) bankNameGroup.style.display = 'none';
                if (accountNumberGroup) accountNumberGroup.style.display = 'none';
                if (prepaidCardInfoGroup) prepaidCardInfoGroup.style.display = 'block';
                if (paymentContactPhoneGroup) paymentContactPhoneGroup.style.display = 'none';
            } else {
                // 사용하지 않음: 자동충전 금액 숨김, 기존 요금 납부 방법 표시, 계좌번호/카드정보 숨김
                if (autoRechargeAmountGroup) autoRechargeAmountGroup.style.display = 'none';
                if (paymentMethodGroup) paymentMethodGroup.style.display = 'block';
                if (accountHolderGroup) accountHolderGroup.style.display = 'block';
                if (bankNameGroup) bankNameGroup.style.display = 'block';
                if (accountNumberGroup) accountNumberGroup.style.display = 'none';
                if (prepaidCardInfoGroup) prepaidCardInfoGroup.style.display = 'none';
                if (paymentContactPhoneGroup) paymentContactPhoneGroup.style.display = 'none';
            }
        }

        console.log('자동 충전 방법 변경:', rechargeMethod);
    });

    // ========================================
    // 3. 고객구분 선택 (내국인 / 외국인 / 법인)
    // ========================================

    function toggleCustomerType(customerType) {
        const foreignerElements = document.querySelectorAll('.foreigner-only');

        switch (customerType) {
            case 'korean':
                // 내국인
                customerNameInput.placeholder = '고객명(법인명)';
                birthDateInput.placeholder = '법정생년월일';
                // 외국인 필드 숨김
                foreignerElements.forEach(el => {
                    el.style.display = 'none';
                });
                break;
            case 'foreigner':
                // 외국인
                customerNameInput.placeholder = 'Name/Corporate Name';
                birthDateInput.placeholder = 'Date of birth';
                // 외국인 필드 표시
                foreignerElements.forEach(el => {
                    el.style.display = '';
                });
                break;
            case 'corporate':
                // 법인
                customerNameInput.placeholder = '법인명';
                birthDateInput.placeholder = '사업자등록번호';
                // 외국인 필드 숨김
                foreignerElements.forEach(el => {
                    el.style.display = 'none';
                });
                break;
        }

        console.log('고객구분 변경:', customerType);
    }

    customerTypeSelect?.addEventListener('change', function() {
        toggleCustomerType(this.value);
    });

    // ========================================
    // 4. 업무구분 선택 (번호이동 / 신규가입 / 기기변경)
    // ========================================

    businessTypeSelect?.addEventListener('change', function() {
        const businessType = this.value;
        const paymentType = paymentTypeSelect?.value;
        const prepaidNumberTransferGroup = document.querySelector('.prepaid-number-transfer');

        switch (businessType) {
            case 'numberTransfer':
                // 번호이동: SIM + 단말기 정보 모두 표시
                toggleVisibility(simFieldGroup, true);
                toggleVisibility(deviceFieldGroup, true);
                // 선불인 경우 선불용 번호이동 필드 표시
                if (paymentType === 'prepaid' && prepaidNumberTransferGroup) {
                    prepaidNumberTransferGroup.style.display = 'block';
                }
                break;
            case 'newSubscription':
                // 신규가입: SIM + 단말기 정보 모두 표시
                toggleVisibility(simFieldGroup, true);
                toggleVisibility(deviceFieldGroup, true);
                // 선불용 번호이동 필드 숨김
                if (prepaidNumberTransferGroup) {
                    prepaidNumberTransferGroup.style.display = 'none';
                }
                break;
            case 'deviceChange':
                // 기기변경: 단말기 정보 필수, SIM은 선택
                toggleVisibility(simFieldGroup, true);
                toggleVisibility(deviceFieldGroup, true);
                // 선불용 번호이동 필드 숨김
                if (prepaidNumberTransferGroup) {
                    prepaidNumberTransferGroup.style.display = 'none';
                }
                break;
        }

        console.log('업무구분 변경:', businessType);
    });

    // ========================================
    // 4-1. 선불 번호이동 알뜰폰 선택 시 업체명 입력
    // ========================================

    const prepaidPreviousCarrierSelect = document.getElementById('prepaidPreviousCarrier');
    const prepaidMvnoNameField = document.getElementById('prepaidMvnoNameField');

    prepaidPreviousCarrierSelect?.addEventListener('change', function() {
        const carrier = this.value;

        // 알뜰폰 선택 시 업체명 입력 필드 표시
        if (carrier.includes('_MVNO')) {
            if (prepaidMvnoNameField) {
                prepaidMvnoNameField.style.display = 'block';
            }
        } else {
            if (prepaidMvnoNameField) {
                prepaidMvnoNameField.style.display = 'none';
            }
        }

        console.log('선불 이전 통신사 변경:', carrier);
    });

    // ========================================
    // 4-2. 가입자와의 관계 변경 (선불 - 신청 고객 대리인 필드 표시)
    // ========================================

    relationshipSelect?.addEventListener('change', function() {
        const relationship = this.value;
        const paymentType = paymentTypeSelect?.value;

        // 선불이고 가입자와의 관계가 본인이 아닐 때 신청 고객 (대리인) 필드 표시
        if (paymentType === 'prepaid') {
            if (relationship !== 'self' && applicantNameGroup) {
                applicantNameGroup.style.display = 'block';
            } else if (applicantNameGroup) {
                applicantNameGroup.style.display = 'none';
            }
        }

        // 후불이고 가입자와의 관계가 본인이 아닐 때 신청 고객명 (대리인) 필드 표시
        if (paymentType === 'postpaid') {
            if (relationship !== 'self' && agentNameGroup) {
                agentNameGroup.style.display = 'block';
            } else if (agentNameGroup) {
                agentNameGroup.style.display = 'none';
            }
        }

        console.log('가입자와의 관계 변경:', relationship);
    });

    // ========================================
    // 5. 요금 납부 방법 (계좌 / 카드 / 지로)
    // ========================================

    paymentMethodSelect?.addEventListener('change', function() {
        const method = this.value;

        switch (method) {
            case 'account':
                // 계좌: 계좌번호 + 은행명 필요
                accountNumberInput.placeholder = '납부할 계좌번호';
                toggleVisibility(bankNameFieldGroup, true);
                // 예금주 라벨 유지
                break;
            case 'card':
                // 카드: 카드번호만 필요, 은행명 숨김
                accountNumberInput.placeholder = '납부할 카드번호';
                toggleVisibility(bankNameFieldGroup, false);
                break;
            case 'giro':
                // 지로: 지로번호만 필요, 은행명 숨김
                accountNumberInput.placeholder = '지로번호';
                toggleVisibility(bankNameFieldGroup, false);
                break;
        }

        console.log('납부방법 변경:', method);
    });

    // ========================================
    // 6. 가입자와 동일 체크박스
    // ========================================

    sameAsSubscriberCheckbox?.addEventListener('change', function() {
        if (this.checked) {
            // 체크됨: 가입 고객 정보 복사
            accountHolderInput.value = customerNameInput.value;
            accountHolderBirthInput.value = birthDateInput.value;
            accountHolderRelationInput.value = '본인';

            // 입력 불가능하게 설정 (disabled)
            accountHolderInput.disabled = true;
            accountHolderBirthInput.disabled = true;
            accountHolderRelationInput.disabled = true;
        } else {
            // 체크 해제: 값 초기화 및 입력 가능
            accountHolderInput.value = '';
            accountHolderBirthInput.value = '';
            accountHolderRelationInput.value = '';

            accountHolderInput.disabled = false;
            accountHolderBirthInput.disabled = false;
            accountHolderRelationInput.disabled = false;
        }

        console.log('가입자와 동일:', this.checked);
    });

    // ========================================
    // 7. eSIM 체크박스
    // ========================================

    isEsimCheckbox?.addEventListener('change', function() {
        if (this.checked) {
            // eSIM 선택: USIM 번호 필드 변경
            usimNumberInput.placeholder = 'eSIM EID 번호';
            usimNumberInput.value = '';
        } else {
            // 물리 SIM: USIM 번호 필드 복원
            usimNumberInput.placeholder = 'USIM번호 8자리';
        }

        console.log('eSIM 선택:', this.checked);
    });

    // ========================================
    // 8. 기타 부가서비스 체크박스
    // ========================================

    otherServiceCheckbox?.addEventListener('change', function() {
        toggleDisabled(otherServiceNameInput, !this.checked);

        // select도 함께 활성화/비활성화
        if (otherServiceNameSelect) {
            toggleDisabled(otherServiceNameSelect, !this.checked);

            // Custom Select도 함께 활성화/비활성화
            const selectWrap = otherServiceNameSelect.closest('.input-wrap');
            const customSelect = selectWrap?.querySelector('.custom-select');
            if (customSelect) {
                if (this.checked) {
                    customSelect.classList.remove('disabled');
                } else {
                    customSelect.classList.add('disabled');
                    customSelect.classList.remove('open');
                }
            }
        }

        if (this.checked) {
            const isMobile = window.innerWidth < 768;
            if (isMobile && otherServiceNameSelect) {
                // 모바일에서는 Custom Select 트리거에 포커스
                const selectWrap = otherServiceNameSelect.closest('.input-wrap');
                const customTrigger = selectWrap?.querySelector('.custom-select-trigger');
                if (customTrigger) {
                    customTrigger.click();
                }
            } else {
                // 데스크톱에서는 input에 포커스
                otherServiceNameInput.focus();
            }
        }

        console.log('기타 부가서비스:', this.checked);
    });

    // ========================================
    // 9. 주소 검색 (다음 우편번호 API)
    // ========================================

    window.searchAddress = function() {
        // 다음 우편번호 API 사용
        if (typeof daum !== 'undefined' && daum.Postcode) {
            new daum.Postcode({
                oncomplete: function(data) {
                    document.getElementById('zipCode').value = data.zonecode;
                    document.getElementById('address').value = data.roadAddress || data.jibunAddress;
                    document.getElementById('addressDetail').focus();
                }
            }).open();
        } else {
            // API 미로드 시 안내
            alert('주소 검색 기능을 사용하려면 다음 우편번호 API 스크립트가 필요합니다.');
        }
    };

    // ========================================
    // 10. 가입 고객 정보 변경 시 동기화
    // ========================================

    // 고객명 변경 시 "가입자와 동일" 체크 상태면 예금주명도 업데이트
    customerNameInput?.addEventListener('input', function() {
        if (sameAsSubscriberCheckbox?.checked) {
            accountHolderInput.value = this.value;
        }
    });

    // 생년월일 변경 시 "가입자와 동일" 체크 상태면 예금주 생년월일도 업데이트
    birthDateInput?.addEventListener('input', function() {
        if (sameAsSubscriberCheckbox?.checked) {
            accountHolderBirthInput.value = this.value;
        }
    });

    // ========================================
    // 초기화: 페이지 로드 시 기본 상태 설정
    // ========================================

    function initializeForm() {
        // 결제방식 기본값에 따라 선불/후불 토글
        if (paymentTypeSelect) {
            togglePaymentType(paymentTypeSelect.value);
        }

        // 고객구분 기본값에 따라 외국인 필드 토글
        if (customerTypeSelect) {
            toggleCustomerType(customerTypeSelect.value);
        }

        // 자동 충전 방법 기본값 확인 (선불용)
        if (autoRechargeMethodSelect) {
            autoRechargeMethodSelect.dispatchEvent(new Event('change'));
        }

        // 납부방법 기본값(계좌) 확인
        if (paymentMethodSelect) {
            paymentMethodSelect.dispatchEvent(new Event('change'));
        }

        // 기타 부가서비스 입력 필드 비활성화
        if (otherServiceNameInput) {
            otherServiceNameInput.disabled = true;
        }

        console.log('폼 초기화 완료');
    }

    // 초기화 실행
    initializeForm();

    // ========================================
    // 11. 청구서 종류 선택에 따른 이메일 입력 폼 토글
    // ========================================

    const billTypeSelect = document.getElementById('billType');
    const emailInputGroup = document.getElementById('emailInputGroup');

    billTypeSelect?.addEventListener('change', function() {
        if (this.value === 'email') {
            emailInputGroup.style.display = 'flex';
        } else {
            emailInputGroup.style.display = 'none';
        }
    });

    // ========================================
    // 12. 요금 납부 방법 선택에 따른 입력 폼 토글
    // ========================================

    const accountNumberField = document.getElementById('accountNumberField');
    const cardNumberField = document.getElementById('cardNumberField');
    const cardExpiryGroup = document.getElementById('cardExpiryGroup');
    const accountHolderGroup = document.getElementById('accountHolderGroup');
    const bankNameGroup = document.getElementById('bankNameGroup');
    const holderInfoLabel = document.getElementById('holderInfoLabel');

    paymentMethodSelect?.addEventListener('change', function() {
        if (this.value === 'card') {
            // 신용카드 선택 시
            accountNumberField.style.display = 'none';
            cardNumberField.style.display = 'block';
            cardExpiryGroup.style.display = 'flex';
            bankNameGroup.style.display = 'none';
            // 라벨 및 placeholder 변경
            holderInfoLabel.innerHTML = '카드주 정보 <span class="required_s">(필수)</span>';
            accountHolderInput.placeholder = '카드주';
        } else {
            // 계좌 선택 시
            accountNumberField.style.display = 'block';
            cardNumberField.style.display = 'none';
            cardExpiryGroup.style.display = 'none';
            accountHolderGroup.style.display = 'block';
            bankNameGroup.style.display = 'block';
            // 라벨 및 placeholder 변경
            holderInfoLabel.innerHTML = '예금주 정보 <span class="required_s">(필수)</span>';
            accountHolderInput.placeholder = '예금주명';
        }
    });

    // ========================================
    // 13. 업무구분 선택에 따른 번호 이동 정보 및 희망번호 토글
    // ========================================

    const numberTransferSection = document.getElementById('numberTransferSection');
    const wishNumberSection = document.getElementById('wishNumberSection');

    // 페이지 로드 시 초기 상태 설정
    if (businessTypeSelect?.value === 'numberTransfer') {
        numberTransferSection.style.display = 'block';
        wishNumberSection.style.display = 'none';
    } else if (businessTypeSelect?.value === 'newSubscription') {
        numberTransferSection.style.display = 'none';
        wishNumberSection.style.display = 'block';
    }

    businessTypeSelect?.addEventListener('change', function() {
        if (this.value === 'numberTransfer') {
            // 번호이동 선택 시
            numberTransferSection.style.display = 'block';
            wishNumberSection.style.display = 'none';
        } else if (this.value === 'newSubscription') {
            // 신규가입 선택 시
            numberTransferSection.style.display = 'none';
            wishNumberSection.style.display = 'block';
        } else {
            // 기기변경 선택 시
            numberTransferSection.style.display = 'none';
            wishNumberSection.style.display = 'none';
        }
    });

    // ========================================
    // 14. 이전 통신사 선택에 따른 알뜰폰 업체명 입력 필드 토글
    // ========================================

    const previousCarrierSelect = document.getElementById('previousCarrier');
    const previousCarrierField = document.getElementById('previousCarrierField');
    const mvnoNameField = document.getElementById('mvnoNameField');

    previousCarrierSelect?.addEventListener('change', function() {
        // 알뜰폰 선택 시 (값에 MVNO가 포함된 경우)
        if (this.value.includes('MVNO')) {
            previousCarrierField.classList.add('device-model-field');
            mvnoNameField.style.display = 'block';
        } else {
            previousCarrierField.classList.remove('device-model-field');
            mvnoNameField.style.display = 'none';
        }
    });

    // ========================================
    // 15. eSIM 체크박스 토글 (확장)
    // ========================================

    const usimInputGroup = document.getElementById('usimInputGroup');
    const esimInputGroup = document.getElementById('esimInputGroup');

    isEsimCheckbox?.addEventListener('change', function() {
        if (this.checked) {
            // eSIM 선택 시
            usimInputGroup.style.display = 'none';
            esimInputGroup.style.display = 'block';
        } else {
            // 일반 USIM 선택 시
            usimInputGroup.style.display = 'block';
            esimInputGroup.style.display = 'none';
        }
    });

    // ========================================
    // 16. 모바일에서 신용카드 유효기간 placeholder 변경
    // ========================================

    const cardExpiryMonth = document.getElementById('cardExpiryMonth');
    const cardExpiryYear = document.getElementById('cardExpiryYear');

    function updateCardExpiryPlaceholder() {
        const isMobile = window.innerWidth < 768;

        // 월 (MM)
        if (cardExpiryMonth) {
            const monthText = isMobile ? '유효기간(MM)' : '신용카드 유효기간 (MM)';
            // 원본 select option 변경
            cardExpiryMonth.options[0].text = monthText;

            // Custom Select 트리거 텍스트 변경 (값이 선택되지 않은 경우)
            const monthCustomSelect = cardExpiryMonth.closest('.select-wrap')?.querySelector('.custom-select');
            if (monthCustomSelect) {
                const monthTrigger = monthCustomSelect.querySelector('.custom-select-trigger');
                const monthFirstOption = monthCustomSelect.querySelector('.custom-select-option');

                if (monthTrigger && cardExpiryMonth.value === '') {
                    monthTrigger.textContent = monthText;
                }
                if (monthFirstOption) {
                    monthFirstOption.textContent = monthText;
                }
            }
        }

        // 년 (YY)
        if (cardExpiryYear) {
            const yearText = isMobile ? '유효기간(YY)' : '신용카드 유효기간 (YY)';
            // 원본 select option 변경
            cardExpiryYear.options[0].text = yearText;

            // Custom Select 트리거 텍스트 변경 (값이 선택되지 않은 경우)
            const yearCustomSelect = cardExpiryYear.closest('.select-wrap')?.querySelector('.custom-select');
            if (yearCustomSelect) {
                const yearTrigger = yearCustomSelect.querySelector('.custom-select-trigger');
                const yearFirstOption = yearCustomSelect.querySelector('.custom-select-option');

                if (yearTrigger && cardExpiryYear.value === '') {
                    yearTrigger.textContent = yearText;
                }
                if (yearFirstOption) {
                    yearFirstOption.textContent = yearText;
                }
            }
        }
    }

    // 초기 실행 (Custom Select 생성 후 실행되도록 약간의 딜레이)
    setTimeout(updateCardExpiryPlaceholder, 100);

    // 화면 크기 변경 시 실행
    window.addEventListener('resize', updateCardExpiryPlaceholder);

    // ========================================
    // 17. 모바일/데스크톱에 따라 기타 부가서비스 select/input 전환
    // ========================================

    const otherServiceNameSelect = document.getElementById('otherServiceNameSelect');

    // 기타 부가서비스 select용 Custom Select 생성
    function createOtherServiceCustomSelect() {
        if (!otherServiceNameSelect) return;

        const selectWrap = otherServiceNameSelect.closest('.input-wrap');
        if (!selectWrap) return;

        // 이미 Custom Select가 있으면 제거
        const existingCustom = selectWrap.querySelector('.custom-select');
        if (existingCustom) {
            existingCustom.remove();
        }

        // Custom Select 생성
        const customSelect = document.createElement('div');
        customSelect.className = 'custom-select';

        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.textContent = otherServiceNameSelect.options[0]?.text || '';

        if (otherServiceNameSelect.value === '') {
            trigger.classList.add('placeholder');
        }

        const optionsList = document.createElement('div');
        optionsList.className = 'custom-select-options';

        Array.from(otherServiceNameSelect.options).forEach((option, index) => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-select-option';
            if (index === otherServiceNameSelect.selectedIndex) {
                customOption.classList.add('selected');
            }
            customOption.textContent = option.text;
            customOption.dataset.value = option.value;

            customOption.addEventListener('click', function(e) {
                e.stopPropagation();

                optionsList.querySelectorAll('.custom-select-option').forEach(opt => {
                    opt.classList.remove('selected');
                });

                this.classList.add('selected');
                trigger.textContent = this.textContent;

                otherServiceNameSelect.value = this.dataset.value;
                otherServiceNameSelect.dispatchEvent(new Event('change', { bubbles: true }));

                if (otherServiceNameSelect.value === '') {
                    trigger.classList.add('placeholder');
                } else {
                    trigger.classList.remove('placeholder');
                }

                customSelect.classList.remove('open');
            });

            optionsList.appendChild(customOption);
        });

        trigger.addEventListener('click', function(e) {
            e.stopPropagation();

            document.querySelectorAll('.custom-select.open').forEach(openSelect => {
                if (openSelect !== customSelect) {
                    openSelect.classList.remove('open');
                }
            });

            customSelect.classList.toggle('open');
        });

        customSelect.appendChild(trigger);
        customSelect.appendChild(optionsList);
        selectWrap.appendChild(customSelect);

        // 원본 select 숨기기
        otherServiceNameSelect.style.display = 'none';
    }

    function updateOtherServiceInputState() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // 모바일: select 보여주기, input 숨기기
            if (otherServiceNameSelect) {
                const selectWrap = otherServiceNameSelect.closest('.input-wrap');
                const customSelect = selectWrap?.querySelector('.custom-select');

                if (customSelect) {
                    customSelect.style.display = 'block';
                } else {
                    // Custom Select가 없으면 생성
                    createOtherServiceCustomSelect();
                }
            }
            if (otherServiceNameInput) {
                otherServiceNameInput.style.display = 'none';
            }
        } else {
            // 데스크톱: input 보여주기, select 숨기기
            if (otherServiceNameSelect) {
                const selectWrap = otherServiceNameSelect.closest('.input-wrap');
                const customSelect = selectWrap?.querySelector('.custom-select');
                if (customSelect) {
                    customSelect.style.display = 'none';
                }
            }
            if (otherServiceNameInput) {
                otherServiceNameInput.style.display = 'block';
            }
        }
    }

    // 초기 실행
    if (otherServiceNameInput || otherServiceNameSelect) {
        // Custom Select 미리 생성
        createOtherServiceCustomSelect();

        // 초기 disabled 상태 설정
        if (otherServiceNameSelect) {
            const selectWrap = otherServiceNameSelect.closest('.input-wrap');
            const customSelect = selectWrap?.querySelector('.custom-select');
            if (customSelect) {
                customSelect.classList.add('disabled');
            }
        }

        updateOtherServiceInputState();
        window.addEventListener('resize', updateOtherServiceInputState);
    }

});
